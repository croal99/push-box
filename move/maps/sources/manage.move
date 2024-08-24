/// Module: maps
#[allow(unused_use, unused_const, unused_field, unused_variable)]
module game::manage {
    use std::ascii::string;
    use std::debug;
    use std::string::{Self, String};
    use sui::url::{Self, Url, new_unsafe_from_bytes};
    use sui::event;
    use sui::table::{Self, Table};
    use game::map::{Self, Map};
    use game::market::{Self, PushBox};
    use game::player::{Self, Player, MapRecord};
    use sui::coin::{Self, TreasuryCap, Coin};
    use sui::object_table::{Self, ObjectTable};
    use sui::balance::{Self, Balance};
    use sui::token::{Self, Token};
    use sui::sui::SUI;
    use sui::transfer::transfer;
    use sui::tx_context::sender;

    /// Error code for incorrect amount.
    const EIncorrectAmount: u64 = 0;
    const EIncorrectNickname: u64 = 1;

    /// Play fee (0.001 Sui)
    const PLAYGAME_PRICE: u64 = 1_000_000;

    /// init record
    const INIT_RECORD: u64 = 1_000_000_000;

    public struct Playground has key, store {
        id: UID,
        name: String,
        description: String,
        url: Url,
        owner: address,                                 // owner
        manager_list: vector<address>,                  // 游戏管理者列表
    }

    public struct PlayerRecord has store {
        nickname: String,
        time: u64,
        step: u64,
    }

    public struct Manage has key, store {
        id: UID,
        name: String,
        description: String,
        url: Url,
        enable: bool,                                   // 是否启用
        total: u64,                                     // 玩家总人数
        players: Table<address, Player>,                // 玩家列表
        record: PlayerRecord,                           // 玩家通关记录
        balance: Balance<SUI>,
        fee: u64,                                       // 游戏费用
        owner: address,                                 // owner
        config_id: ID,                                  // game config object id
        maps_count: u64,                                // 游戏地图数量
    }

    // ===== Events =====

    public struct ManagerMinted has copy, drop {
        object_id: ID,
        creator: address,
        name: string::String,
    }

    // 更新记录
    public struct UpdateRecord has copy, drop {
        player_address: address,
        record: u64,
        reason: string::String,
    }

    #[allow(unused_function)]
    fun init(_ctx: &mut TxContext) {
    }

    // ===== Public view functions =====

    public fun name(manager: &Manage): &string::String {
        &manager.name
    }

    public fun description(manager: &Manage): &string::String {
        &manager.description
    }

    // 更新游戏名称
    public entry fun update_name(
        manager: &mut Manage,
        new_name: vector<u8>,
        _: &mut TxContext
    ) {
        manager.name = string::utf8(new_name)
    }

    // 更新游戏描述
    public entry fun update_description(
        manager: &mut Manage,
        new_description: vector<u8>,
        _: &mut TxContext
    ) {
        manager.description = string::utf8(new_description)
    }

    // 更新玩游戏费率
    public entry fun update_fee(
        manager: &mut Manage,
        new_fee: u64,
        _: &mut TxContext
    ) {
        manager.fee = new_fee
    }

    // 更新游戏地图数量
    public entry fun update_maps_count(
        manager: &mut Manage,
        maps_count: u64,
        _: &mut TxContext
    ) {
        manager.maps_count = maps_count;
    }

    public fun borrow(manager: &Manage, player_address: address): &Player {
        debug::print(&string::utf8(b"borrow"));
        manager.players.borrow(player_address)
    }

    public fun borrow_mut(manager: &mut Manage, player_address: address): &mut Player {
        debug::print(&string::utf8(b"borrow_mut"));
        manager.players.borrow_mut(player_address)
    }

    public fun remove(manager: &mut Manage, player_address: address): Player {
        debug::print(&string::utf8(b"remove"));
        manager.players.remove(player_address)
    }

    // 创建游戏城对象，保存可以使用的游戏
    public entry fun create_playground(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        // create manager
        let playground = Playground {
            id: sui::object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url),
            owner: sender,
            manager_list: vector<address>[],
        };

        // share object
        transfer::public_share_object(playground);
    }

    // 创建游戏管理，同时创建游戏地图（可以用范型来实现更多游戏管理）
    public entry fun create_manager(
        playground: &mut Playground,
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        // create push-box maps
        let game = market::initialize_maps(b"Sokoban", b"Sokoban Maps", b"", ctx);

        // create manager
        let manager = Manage {
            id: sui::object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url),
            enable: true,
            total:0,
            players: table::new<address, Player>(ctx),
            record: PlayerRecord {
                nickname: string::utf8(b"nobody"),
                time: INIT_RECORD,
                step: INIT_RECORD
            },
            balance: balance::zero(),
            fee: PLAYGAME_PRICE,
            owner: sender,
            config_id: object::id(&game),
            maps_count: 0,
        };

        // 提交event
        event::emit(ManagerMinted {
            object_id: object::id(&manager),
            creator: sender,
            name: manager.name,
        });

        // 添加到游戏城列表
        playground.manager_list.push_back(object::id_address(&manager));

        // 游戏配置对象只能由创建者修改
        transfer::public_transfer(game, tx_context::sender(ctx));

        // manager对象需要share，否则玩家无法加入游戏
        transfer::public_share_object(manager);
    }

    // 付费玩游戏
    public entry fun play_game(
        manager: &mut Manage,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(coin::value(&payment) == manager.fee, EIncorrectAmount);
        // debug::print(manager);

        // 玩家地址
        let player_address = tx_context::sender(ctx);
        // coin::put(&mut manager.balance, payment);

        // 查询是否存在玩家数据
        if (manager.players.contains(player_address)) {
            debug::print(&string::utf8(b"player is exist."));
            // 退回Coin
            transfer::public_transfer(payment, tx_context::sender(ctx));
        } else {
            debug::print(&string::utf8(b"add player"));
            let game = market::initialize_maps(
                b"player_map",
                b"",
                b"",
                ctx);
            let player = player::create_player(b"", &game, ctx);

            manager.players.add(player_address, player);
            manager.total = manager.total + 1;

            // 支付给游戏创建者
            transfer::public_transfer(payment, manager.owner);
            transfer::public_transfer(game, tx_context::sender(ctx));
        }
    }

    public entry fun join_game(
        manager: &mut Manage,
        nickname: vector<u8>,               // 玩家昵称
        ctx: &mut TxContext
    ) {
        // 玩家地址
        let player_address = tx_context::sender(ctx);

        // 查询是否存在玩家数据
        if (manager.players.contains(player_address)) {
            debug::print(&string::utf8(b"player is exist."));
        } else {
            debug::print(&string::utf8(b"add player"));
            let mut description = string::utf8(nickname);
            string::append_utf8(&mut description, b"'s played maps");
            let game = market::initialize_maps(b"player_map", description.into_bytes(), b"", ctx);
            let player = player::create_player(nickname, &game, ctx);

            manager.players.add(player_address, player);
            manager.total = manager.total + 1;

            transfer::public_transfer(game, tx_context::sender(ctx));
        }
    }

    // 记录最佳成绩
    public entry fun update_record(
        manager: &mut Manage,
        payment: Coin<SUI>,
        nickname: vector<u8>,               // 玩家昵称
        time: u64,
        step: u64,
        ctx: &mut TxContext
    ) {
        assert!(coin::value(&payment) == PLAYGAME_PRICE, EIncorrectAmount);
        assert!(nickname.length() <= 10, EIncorrectNickname);

        // 玩家地址
        let player_address = tx_context::sender(ctx);

        // 查询是否存在玩家数据
        if (manager.players.contains(player_address)) {
            debug::print(&string::utf8(b"update record"));
            // 支付给游戏创建者
            transfer::public_transfer(payment, manager.owner);

            // 记录时间最少
            if (time < manager.record.time && time > 0) {
                manager.record.nickname = string::utf8(nickname);
                manager.record.time = time;

                // 提交event
                event::emit(UpdateRecord {
                    player_address,
                    record: time,
                    reason: string::utf8(b"time record"),
                });
            };

            // 记录步数最少
            if (step < manager.record.step && step > 0) {
                manager.record.nickname = string::utf8(nickname);
                manager.record.step = step;

                // 提交event
                event::emit(UpdateRecord {
                    player_address,
                    record: step,
                    reason: string::utf8(b"step record"),
                });
            };
        } else {
            // 退回Coin
            transfer::public_transfer(payment, tx_context::sender(ctx));
        }
    }

    // public entry fun burn(manager: Manage, _ctx: &mut TxContext) {
    //     let Manage { id, name: _, description: _, url: _, total: _, players, records } = manager;
    //     players.drop();
    //     records.drop();
    //     sui::object::delete(id)
    // }

    // ===== Tests =====

    #[test_only]
    public fun test_for_init(
        ctx: &mut TxContext
    ) {
        init(ctx);
    }
}

