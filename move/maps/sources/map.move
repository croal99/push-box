/// Module: game
#[allow(unused_use, unused_const, unused_field, unused_variable)]
module game::map {
    use std::debug;
    use std::string::{Self, String};
    use sui::url::{Self, Url, new_unsafe_from_bytes};
    use sui::event;
    use sui::table::{Self, Table};

    const EMapData: u64 = 0;

    public struct Map has copy, store, drop {
        level: u64,                     // 难度 （1/2/3/4/5）
        enable: bool,                   // 是否启用
        time: u64,                      // 通关时间（0 - 无限）
        reset: u64,                     // 重玩次数（0 - 无限）
        data: vector<vector<u8>>        // 16 x 16 地图数据
    }

    #[allow(unused_function)]
    fun init(_ctx: &mut TxContext) {
    }

    // ===== Public view functions =====

    public fun level(map: &Map): u64 {
        map.level
    }

    public fun enable(map: &Map): bool {
        map.enable
    }

    public fun time(map: &Map): u64 {
        map.time
    }

    public fun reset(map: &Map): u64 {
        map.reset
    }

    public fun data(map: &Map): &vector<vector<u8>> {
        &map.data
    }

    // ===== Entrypoints =====
    public fun create_map(
        data: vector<vector<u8>>,
        _ctx: &mut TxContext
    ): Map {
        // debug::print(&data);
        assert!(data.length() == 16, EMapData);

        let map = Map {
            level: 1,
            enable: true,
            time: 0,
            reset: 0,
            data,
        };

        map
    }

    public fun update_detail(
        map: &mut Map,
        level: u64,                     // 难度 （1/2/3/4/5）
        enable: bool,                   // 是否启用
        time: u64,                      // 通关时间（0 - 无限）
        reset: u64,                     // 重玩次数（0 - 无限）
        _: &mut TxContext
    ) {
        map.level = level;
        map.enable = enable;
        map.time = time;
        map.reset = reset;
    }

    public fun update_level(
        map: &mut Map,
        new_level: u64,
        _: &mut TxContext
    ) {
        map.level = new_level
    }

    public fun update_enable(
        map: &mut Map,
        new_enable: bool,
        _: &mut TxContext
    ) {
        map.enable = new_enable
    }

    public fun update_time(
        map: &mut Map,
        new_time: u64,
        _: &mut TxContext
    ) {
        map.time = new_time
    }

    public fun update_reset(
        map: &mut Map,
        new_reset: u64,
        _: &mut TxContext
    ) {
        map.time = new_reset
    }

    public fun update_data(
        map: &mut Map,
        new_data: vector<vector<u8>>,
        _: &mut TxContext
    ) {
        assert!(new_data.length() == 16, EMapData);
        map.data = new_data
    }

    // ===== Tests =====

    #[test_only]
    public fun test_for_init(
        ctx: &mut TxContext
    ) {
        init(ctx);
    }
}

