/// Module: game
#[allow(unused_use, unused_const, unused_field, unused_variable)]
module game::player {
    use std::debug;
    use std::string::{Self, String};
    use sui::url::{Self, Url, new_unsafe_from_bytes};
    use sui::event;
    use sui::table::{Self, Table};
    use sui::object_table::{Self, ObjectTable};
    use game::market::{Self, PushBox};
    use game::map::Map;

    const EMapData: u64 = 0;

    public struct MapRecord has copy, store, drop {
        passed: bool,                   // 是否通关
        time: u64,                      // 通关时间
        reset: u64,                     // 重玩次数
    }

    public struct Player has store, drop {
        nickname: String,                           // 玩家昵称
        address: address,                           // 玩家地址
        record_id: ID,                              // Maps对象ID（用于记录用户拥有的地图）
        total_pass: u64,                            // 已经通关的地图总数
        total_time: u128,                           // 游戏时间
        // records: ObjectTable<address, PushBox>,        // 玩家通关记录
    }

    // ===== Events =====
    public struct PlayerMinted has copy, drop {
        creator: address,
        name: string::String,
    }

    #[allow(unused_function)]
    fun init(_ctx: &mut TxContext) {
    }

    // ===== Public view functions =====

    public fun create_player(
        nickname: vector<u8>,
        maps: &PushBox,
        ctx: &mut TxContext
    ): Player {
        let player = Player {
            nickname: string::utf8(nickname),
            address: tx_context::sender(ctx),
            record_id: object::id<PushBox>(maps),
            // records: object_table::new<address, PushBox>(ctx),
            total_pass: 0,
            total_time: 0,
        };

        player
    }

    public fun create_record(
        _map: &Map,
        _ctx: &mut TxContext
    ): MapRecord {
        let record = MapRecord {
            passed: false,
            time: 0,
            reset: 0,
        };

        record
    }

    // public entry fun burn(map: Map, _ctx: &mut TxContext) {
    //     let Map {id, name: _, description: _, url: _, data: _} = map;
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

