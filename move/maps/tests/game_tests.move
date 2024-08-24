#[test_only]
#[allow(unused_use, unused_variable)]
module game::maps_tests {
    // uncomment this line to import the module
    use std::debug;
    use std::ascii::string;
    use std::string::{Self, String};
    use sui::test_scenario as ts;
    use sui::table::{Self, Table};
    use game::map::{Self, Map};
    use game::market::{Self, PushBox};
    use game::manage::{Self, Manage, Playground};
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::sui::SUI;

    #[test]
    fun test_manage() {
        let admin = @0xA;
        let user = @0xB;
        let mut scenario = ts::begin(admin);
        let mut playground: Playground;
        let mut manager: Manage;

        // init
        ts::next_tx(&mut scenario, admin);
        {
            manage::test_for_init(scenario.ctx());
        };

        // create playground
        ts::next_tx(&mut scenario, admin);
        {
            manage::create_playground(b"playground", b"my supper playground", b"https://", scenario.ctx());
        };
        ts::next_tx(&mut scenario, admin);
        {
            playground = ts::take_shared<Playground>(&scenario);
            debug::print(&playground);
        };

        // create manager
        ts::next_tx(&mut scenario, admin);
        {
            manage::create_manager(&mut playground,b"test manager", b"push-box manager", b"https://", scenario.ctx());
        };
        ts::next_tx(&mut scenario, admin);
        {
            manager = ts::take_shared<Manage>(&scenario);
            // debug::print(manage::name(&manager))
        };

        // play game with user
        ts::next_tx(&mut scenario, user);
        {
            let pay = coin::mint_for_testing<SUI>(1_000_000, scenario.ctx());
            manage::play_game(&mut manager, pay,scenario.ctx());
        };

        // update record
        ts::next_tx(&mut scenario, user);
        {
            let pay = coin::mint_for_testing<SUI>(1_000_000, scenario.ctx());
            manage::update_record(&mut manager, pay, b"user 1", 10, 10,scenario.ctx());
            debug::print(&manager)
        };

        // update record
        ts::next_tx(&mut scenario, user);
        {
            let pay = coin::mint_for_testing<SUI>(1_000_000, scenario.ctx());
            manage::update_record(&mut manager, pay, b"user 2", 5, 0,scenario.ctx());
            debug::print(&manager)
        };

        ts::next_tx(&mut scenario, admin);
        {
            ts::return_shared<Manage>(manager);
            ts::return_shared<Playground>(playground);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_market() {
        let admin = @0xA;
        let user = @0xB;
        let mut scenario = ts::begin(admin);
        let mut game: PushBox;
        let map_data_1 : vector<vector<u8>> = vector[
            vector[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            vector[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            vector[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            vector[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            vector[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            vector[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            vector[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            vector[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            vector[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            vector[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            vector[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            vector[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            vector[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            vector[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            vector[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            vector[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ];
        let map_data_2 : vector<vector<u8>> = vector[
            vector[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            vector[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            vector[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            vector[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            vector[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            vector[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            vector[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            vector[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            vector[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            vector[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            vector[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            vector[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            vector[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            vector[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            vector[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            vector[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
        ];
        let map_data_3 : vector<vector<u8>> = vector[
            vector[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            vector[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            vector[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            vector[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            vector[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            vector[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            vector[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            vector[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            vector[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            vector[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            vector[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            vector[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            vector[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            vector[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            vector[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            vector[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
        ];

        // init
        ts::next_tx(&mut scenario, admin);
        {
            market::test_for_init(scenario.ctx());
        };

        // create_maps
        ts::next_tx(&mut scenario, admin);
        {
            // market::create_maps(b"first", b"first maps",b"https://img1.baidu.com/it/u=1098260531,3739648624&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",scenario.ctx());
        };

        ts::next_tx(&mut scenario, admin);
        {
            // game = ts::take_from_sender<PushBox>(&scenario);
            game = market::initialize_maps(b"first", b"first maps",b"https://img1.baidu.com/it/u=1098260531,3739648624&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",scenario.ctx());
            debug::print(market::name(&game));
        };

        ts::next_tx(&mut scenario, admin);
        {
            market::add_map(&mut game, map_data_1, scenario.ctx());
            market::add_map(&mut game, map_data_2, scenario.ctx());
        };

        ts::next_tx(&mut scenario, user);
        {
            debug::print(&string::utf8(b"buy maps"));
            market::buy(&game, scenario.ctx());
        };

        ts::next_tx(&mut scenario, admin);
        {
            debug::print(&string::utf8(b"update maps[0] detail"));
            let maps = game.data_mut();
            map::update_detail(&mut maps[0], 999, false, 999, 999, scenario.ctx());
        };

        ts::next_tx(&mut scenario, admin);
        {
            debug::print(&string::utf8(b"update maps[1] data"));
            game.update_map_data(1, map_data_3, scenario.ctx());
        };

        ts::next_tx(&mut scenario, admin);
        {
            debug::print(&string::utf8(b"admin maps"));
            debug::print(&game.data().length());
            let mut index = 0;
            let length = game.data().length();
            while (index < length) {
                debug::print(&game.data()[index]);
                index = index + 1;
            }
        };

        ts::next_tx(&mut scenario, user);
        {
            debug::print(&string::utf8(b"user maps"));
            debug::print(&game.data().length());
            let user_game = ts::take_from_sender<PushBox>(&scenario);
            let mut index = 0;
            let length = user_game.data().length();
            while (index < length) {
                debug::print(&user_game.data()[index]);
                index = index + 1;
            };
            ts::return_to_sender<PushBox>(&scenario, user_game);
        };

        ts::next_tx(&mut scenario, admin);
        {
            market::burn(game, scenario.ctx());
        };

        ts::end(scenario);
    }
}
