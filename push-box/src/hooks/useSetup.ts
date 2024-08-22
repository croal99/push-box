import {useCurrentAccount, useSignAndExecuteTransaction} from "@mysten/dapp-kit";
import {useEffect, useState} from "react";
import {useSui} from "./useSui";
import {Transaction} from "@mysten/sui/transactions";
import {useManager} from "@/hooks/useManager.ts";
import {SuiMoveObject} from "@mysten/sui/client";
import {PlayerOnChain} from "@/types/PlayerOnChain.ts";
import {PlaygroundOnChain} from "@/types/PlaygroundOnChain.ts";
import {MapOnChain} from "@/types/MapOnChain.ts";
import {ManageOnChain} from "@/types/ManageOnChain.ts";
import {PushBoxOnChain} from "@/types/PushBoxOnChain.ts";
import {usePlayground} from "@/hooks/usePlayground.ts";
import {levels} from "@/hooks/mapdata100.ts";

export const useSetup = () => {
    const account = useCurrentAccount();

    const {mutate: signAndExecuteTransaction} = useSignAndExecuteTransaction();
    const {getManagerList} = usePlayground();

    // 配置信息
    const env = import.meta.env;
    const MARKET_PACKAGE_ID = env.VITE_MARKET_PACKAGE_ID;       // 合约
    const PLAYGROUND_ID = env.VITE_PLAYGROUND_ID;

    const handleInitManager = (name, description, url, handleSuccess, handleError) => {
        const tb = new Transaction();
        tb.setSender(account?.address);

        for (let level = 1; level < 11; level++) {
            tb.moveCall({
                target: `${MARKET_PACKAGE_ID}::manage::create_manager`,
                arguments: [
                    tb.object(PLAYGROUND_ID),
                    tb.pure.string(name),
                    tb.pure.string(description + " " + level),
                    tb.pure.string(url),
                ],
            })

        }

        // 将PTB签名上链
        signAndExecuteTransaction(
            {
                transaction: tb,
            },
            {
                onSuccess: (result) => {
                    handleSuccess(result);
                },
                onError: (result) => {
                    handleError(result);
                }
            },
        );

    }

    const handleInitMaps = async () => {
        const map_list = levels;
        const manager_list = await getManagerList(PLAYGROUND_ID);
        let init_index = 0;
        let init_group = Math.floor(map_list.length / manager_list.length);

        console.log(map_list.length, manager_list.length, init_group);
        const tb = new Transaction();
        tb.setSender(account?.address);

        for (const index in manager_list) {
            const manager = manager_list[index] as ManageOnChain;
            // console.log('manager', manager);
            for (let i = 0; i < init_group; i++) {
                const init_map = map_list[init_index++];
                // console.log(init_index);

                // insert map data
                tb.moveCall({
                    target: `${MARKET_PACKAGE_ID}::market::add_map`,
                    arguments: [
                        tb.object(manager.config_id),                             // maps: &mut Maps
                        tb.pure('vector<vector<u8>>', init_map),
                    ],
                });
            }

            // update maps count
            tb.moveCall({
                target: `${MARKET_PACKAGE_ID}::manage::update_maps_count`,
                arguments: [
                    tb.object(manager.id.id),                             // manager: &mut Manage,
                    tb.pure.u64(init_group),
                ],
            });
        }

        // 将PTB签名上链
        signAndExecuteTransaction(
            {
                transaction: tb,
            },
            {
                onSuccess: (result) => {
                    console.log('executed transaction', result);
                },
                onError: (result) => {
                    console.log('trans error', result.message);
                }
            },
        );


    }

    return {
        handleInitManager,
        handleInitMaps,
    }
}