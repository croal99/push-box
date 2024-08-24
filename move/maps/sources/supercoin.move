#[allow(duplicate_alias, unused_use)]
/// Module: faucetcoin
module game::super_coin {
    use std::string::{Self, String};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use std::option;
    use std::option::none;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::url::{Self, Url, new_unsafe_from_bytes};
    use sui::token::{Self, Token, ActionRequest};

    /// Trying to purchase Gems with an unexpected amount.
    const EUnknownAmount: u64 = 0;

    /// 10 SUI is the price of a small bundle of Gems.
    const SMALL_BUNDLE: u64 = 10_000_000_000;
    const SMALL_AMOUNT: u64 = 100;

    /// 100 SUI is the price of a medium bundle of Gems.
    const MEDIUM_BUNDLE: u64 = 100_000_000_000;
    const MEDIUM_AMOUNT: u64 = 5_000;

    /// 1000 SUI is the price of a large bundle of Gems.
    /// This is the best deal.
    const LARGE_BUNDLE: u64 = 1_000_000_000_000;
    const LARGE_AMOUNT: u64 = 100_000;

    #[allow(lint(coin_field))]
    /// Gems can be purchased through the `Store`.
    public struct CoinStore has key {
        id: UID,
        /// Profits from selling Gems.
        profits: Balance<SUI>,
        /// The Treasury Cap for the in-game currency.
        gem_treasury: TreasuryCap<SUPER_COIN>,
    }

    public struct SUPER_COIN has drop {}

    #[lint_allow(self_transfer)]
    #[allow(lint(share_owned))]
    fun init(
        witness: SUPER_COIN,
        ctx: &mut TxContext
    ) {
        let (treasury_cap, metadata) = coin::create_currency(
            witness,
            0,                // decimals
            b"SuperCoin",           // symbol
            b"Super Coin",       // name
            b"User coin in the playgrpund", // description
            none(),
            ctx
        );

        let (mut policy, cap) = token::new_policy(&treasury_cap, ctx);

        token::allow(&mut policy, &cap, buy_action(), ctx);
        token::allow(&mut policy, &cap, token::spend_action(), ctx);

        transfer::public_freeze_object(metadata);
        transfer::public_share_object(treasury_cap);
        transfer::public_transfer(cap, ctx.sender());
        token::share_policy(policy);
    }

    #[lint_allow(self_transfer)]
    #[allow(unused_variable)]
    public entry fun mint(
        treasury_cap: &mut TreasuryCap<SUPER_COIN>,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext,
    ) {
        let coin = coin::mint(treasury_cap, amount, ctx);
        transfer::public_transfer(coin, recipient)
    }

    public fun burn(
        treasury_cap: &mut TreasuryCap<SUPER_COIN>,
        coin: Coin<SUPER_COIN>
    ) {
        coin::burn(treasury_cap, coin);
    }

    /// Purchase Coin
    public fun buy_gems(
        self: &mut CoinStore, payment: Coin<SUI>, ctx: &mut TxContext
    ): (Token<SUPER_COIN>, ActionRequest<SUPER_COIN>) {
        let amount = coin::value(&payment);
        let purchased = if (amount == SMALL_BUNDLE) {
            SMALL_AMOUNT
        } else if (amount == MEDIUM_BUNDLE) {
            MEDIUM_AMOUNT
        } else if (amount == LARGE_BUNDLE) {
            LARGE_AMOUNT
        } else {
            abort EUnknownAmount
        };

        coin::put(&mut self.profits, payment);

        // create custom request and mint some Gems
        let gems = token::mint(&mut self.gem_treasury, purchased, ctx);
        let req = token::new_request(buy_action(), purchased, none(), none(), ctx);

        (gems, req)
    }

    /// The name of the `buy` action in the `GemStore`.
    public fun buy_action(): String { string::utf8(b"buy") }


    // === Tests ===
    #[test_only]
    use sui::test_scenario as ts;

    #[test_only]
    public fun test_for_init(
        ctx: &mut TxContext
    ) {
        init(SUPER_COIN {}, ctx);
    }
}
