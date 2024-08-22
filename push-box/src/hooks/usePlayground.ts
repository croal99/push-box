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

export const usePlayground = () => {
    const {suiClient} = useSui();
    const account = useCurrentAccount();

    const {getManageObject, getPushBoxObject} = useManager();

    // 状态量
    const [isLoading, setIsLoading] = useState(false);
    const [playerList, setPlayerList] = useState([]);
    const [digest, setDigest] = useState('');
    const [message, setMessage] = useState('');

    const {mutate: signAndExecuteTransaction} = useSignAndExecuteTransaction();

    // 配置信息
    const env = import.meta.env;
    const MARKET_PACKAGE_ID = env.VITE_MARKET_PACKAGE_ID;       // 合约
    const PLAYGROUND_ID = env.VITE_PLAYGROUND_ID;

    const MANAGER_TABLE_ID = env.VITE_MANAGER_TABLE_ID;

    const PLAYER_TABLE_ID = env.VITE_PLAYER_TABLE_ID;

    const handleRestart = () => {
        console.log('reset game', suiClient);
    };

    const handleCreatePlayground = (name, description, url) => {
        console.log('create playground', MARKET_PACKAGE_ID);
        const tb = new Transaction();
        tb.setSender(account?.address);

        tb.moveCall({
            target: `${MARKET_PACKAGE_ID}::manage::create_playground`,
            arguments: [
                tb.pure.string(name),
                tb.pure.string(description),
                tb.pure.string(url),
            ],
        })

        // 将PTB签名上链
        signAndExecuteTransaction(
            {
                transaction: tb,
            },
            {
                onSuccess: (result) => {
                    console.log('executed create_playground transaction', result);
                    setDigest(result.digest);
                },
                onError: (result) => {
                    console.log('trans error', result.message);
                    setMessage(result.message);
                }
            },
        );
    }

    const handleCreateManager = (name, description, url, handleSuccess, handleError) => {
        const tb = new Transaction();
        tb.setSender(account?.address);

        tb.moveCall({
            target: `${MARKET_PACKAGE_ID}::manage::create_manager`,
            arguments: [
                tb.object(PLAYGROUND_ID),
                tb.pure.string(name),
                tb.pure.string(description),
                tb.pure.string(url),
            ],
        })

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

    const handleJoinGame = (nickname) => {
        console.log('join game', nickname);
        console.log('accound', account);

        setIsLoading(true);

        const tb = new Transaction();
        tb.setSender(account?.address);

        tb.moveCall({
            target: `${MARKET_PACKAGE_ID}::manage::join_game`,
            arguments: [
                tb.object(PLAYGROUND_ID),
                tb.pure.string(nickname),
            ],
        })

        // 将PTB签名上链
        signAndExecuteTransaction(
            {
                transaction: tb,
            },
            {
                onSuccess: (result) => {
                    console.log('executed transaction', result);
                    setDigest(result.digest);
                    setIsLoading(false);
                },
                onError: (result) => {
                    console.log('trans error', result.message);
                    setMessage(result.message);
                    setIsLoading(false);
                }
            },
        );
    }

    const handlePayAndPlayGame = (manager: ManageOnChain, handlePaySuccess, handlePayError) => {
        const tb = new Transaction();
        tb.setSender(account?.address);
        const payment = tb.splitCoins(tb.gas, [1000000]);

        tb.moveCall({
            target: `${MARKET_PACKAGE_ID}::manage::play_game`,
            arguments: [
                tb.object(manager.id.id),
                payment,
            ],
        })


        // 将PTB签名上链
        signAndExecuteTransaction(
            {
                transaction: tb,
            },
            {
                onSuccess: (result) => {
                    console.log('executed transaction', result);
                    // setDigest(result.digest);
                    handlePaySuccess(manager);
                },
                onError: (result) => {
                    console.log('trans error', result.message);
                    // setMessage(result.message);
                    handlePayError(result);
                }
            },
        );
    }

    const getPlaygroundObject = async (id: string) => {
        const res = await suiClient.getObject({
            id,
            options: {
                showContent: true,
            }
        })

        let base = res.data.content.fields as PlaygroundOnChain;
        console.log('Playground object', base);

        return base;
    }

    const getManagerList = async (id: string) => {
        const tempList = [];
        const playground = await getPlaygroundObject(id)
        for (const index in playground.manager_list) {
            const manager_id = playground.manager_list[index];
            // console.log('item', index, manager_id);
            const manager = await getManageObject(manager_id)
            tempList.push(manager);
        }
        return tempList;
    }

    return {
        isLoading,
        digest,
        getManagerList,
        handleCreatePlayground,
        getPlaygroundObject,
        handleCreateManager,
        handleJoinGame,
        handlePayAndPlayGame,
    }
}