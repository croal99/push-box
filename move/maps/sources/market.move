/// Module: maps
#[allow(unused_use, unused_const, unused_field, unused_variable)]
module game::market {
    use std::debug;
    use std::string::{Self, String};
    use sui::url::{Self, Url, new_unsafe_from_bytes};
    use sui::event;
    use game::map::{Self, Map};

    const EMapData: u64 = 0;

    public struct PushBox has key, store {
        id: UID,
        name: String,
        description: String,
        url: Url,
        maps: vector<Map>,
    }

    // ===== Events =====

    public struct MapsMinted has copy, drop {
        object_id: ID,
        creator: address,
        name: string::String,
    }

    #[allow(unused_function)]
    fun init(_ctx: &mut TxContext) {
    }

    // ===== Public view functions =====

    public fun name(game: &PushBox): &string::String {
        &game.name
    }

    public fun description(game: &PushBox): &string::String {
        &game.description
    }

    public fun data(game: &PushBox): &vector<Map> {
        &game.maps
    }

    public fun data_mut(game: &mut PushBox): &mut vector<Map> {
        &mut game.maps
    }

    public entry fun update_description(
        game: &mut PushBox,
        new_description: vector<u8>,
        _: &mut TxContext
    ) {
        game.description = string::utf8(new_description)
    }

    public entry fun create_maps(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let game = initialize_maps(name, description, url, ctx);

        transfer::public_transfer(game, tx_context::sender(ctx));
    }

    public fun initialize_maps(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ): PushBox {
        let sender = tx_context::sender(ctx);
        let game = PushBox {
            id: sui::object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url),
            maps: vector<Map>[],
        };

        event::emit(MapsMinted {
            object_id: object::id(&game),
            creator: sender,
            name: game.name,
        });

        game
    }

    public fun add_map(
        game: &mut PushBox,
        data: vector<vector<u8>>,       // 16 x 16 地图数据
        ctx: &mut TxContext
    ) {
        let map = map::create_map(data, ctx);
        game.maps.push_back(map);
    }

    public entry fun buy(
        game: &PushBox,
        ctx: &mut TxContext
    ) {
        let new_game = PushBox {
            id: sui::object::new(ctx),
            name: game.name,
            description: game.description,
            url: game.url,
            maps: game.maps,
        };

        transfer::public_transfer(new_game, tx_context::sender(ctx));
    }

    public entry fun update_map_data(
        game: &mut PushBox,
        index: u64,                     // 地图索引
        data: vector<vector<u8>>,       // 16 x 16 地图数据
        ctx: &mut TxContext
    ) {
        let maps = game.data_mut();
        maps[index].update_data(data, ctx);
    }

    public entry fun burn(game: PushBox, _ctx: &mut TxContext) {
        let PushBox { id, name: _, description: _, url: _, maps } = game;
        sui::object::delete(id)
    }

    // ===== Tests =====

    #[test_only]
    public fun test_for_init(
        ctx: &mut TxContext
    ) {
        init(ctx);
    }
}

