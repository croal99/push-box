import {useEffect, useState} from "react";
import {useSui} from "./useSui";
import {useCurrentAccount, useSignAndExecuteTransaction} from "@mysten/dapp-kit";
import {Transaction} from "@mysten/sui/transactions";
import {PlayerOnChain} from "@/types/PlayerOnChain.ts";
import {SuiMoveObject} from "@mysten/sui/client";

export const usePlayerManage = () => {
    const {suiClient} = useSui();
    const account = useCurrentAccount();

    const [isLoading, setIsLoading] = useState(false);
    const [digest, setDigest] = useState('');
    const [message, setMessage] = useState('');

    const {mutate: signAndExecuteTransaction} = useSignAndExecuteTransaction();

    // 配置信息
    const env = import.meta.env;
    const MARKET_PACKAGE_ID = env.VITE_MARKET_PACKAGE_ID;       // 合约
    const PLAYER_TABLE_ID = env.VITE_PLAYER_TABLE_ID;

    const getPlayer = (playerList:PlayerOnChain[] ) => {
        const address = account?.address
        console.log('check sign in', address, playerList);

        for (const playerListKey in playerList) {
            const player = playerList[playerListKey];
            if (player.address == address) {
                // 查询到用户信息
                console.log('player exist', player);
                return player;
            }
        }

        return false;
    }

    const checkPlayerSignIn = (playerList:PlayerOnChain[] ) => {
        const address = account?.address
        console.log('check sign in', address, playerList);

        for (const playerListKey in playerList) {
            const player = playerList[playerListKey];
            if (player.address == address) {
                // 查询到用户信息
                console.log('player exist', player);
                return true;
            }
        }

        return false;
    }

    const getPlayerList = async () => {
        setIsLoading(true);

        const tempList = [];

        // 读取列表
        const dynamicFieldPage = await suiClient.getDynamicFields({parentId: PLAYER_TABLE_ID});
        const resultData = dynamicFieldPage.data;
        for (const index in resultData) {
            const objectId = resultData[index].objectId;
            // console.log('player id', playerId);
            const player = await getPlayerObject(objectId);
            tempList.push(player);
        }

        const coin = await suiClient.getCoins({
            owner: account?.address,
            coinType: "0x445cee99e9abbdb62bf1f6067834e834f36ea6c1723b2bc2977244d0a3c62e36::faucet_coin::FAUCET_COIN"
        });
        console.log('coin', coin);

        setIsLoading(false);

        return tempList;
    }

    const getPlayerObject = async (id: string) => {
        const res = await suiClient.getObject({
            id,
            options: {
                showContent: true,
            }
        })

        const base = res.data.content.fields;
        const playerObject = base?.value as SuiMoveObject;
        // console.log('sui object', playerObject);
        const {fields} = playerObject;
        // console.log('fields', fields);

        return fields as unknown as PlayerOnChain;
    }

    return {
        isLoading,
        getPlayer,
        getPlayerList,
        checkPlayerSignIn,
    }
}