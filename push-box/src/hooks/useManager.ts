import {useCurrentAccount, useSignAndExecuteTransaction} from "@mysten/dapp-kit";
import {useEffect, useState} from "react";
import {useSui} from "./useSui";
import {Transaction} from "@mysten/sui/transactions";
import {MapOnChain} from "@/types/MapOnChain.ts";
import {SuiMoveObject} from "@mysten/sui/client";
import {PlayerOnChain} from "@/types/PlayerOnChain.ts";
import {PushBoxOnChain} from "@/types/PushBoxOnChain.ts";
import {ManageOnChain} from "@/types/ManageOnChain.ts";

export const useManager = () => {
    const {suiClient} = useSui();
    const account = useCurrentAccount();

    // 状态量
    const [isLoading, setIsLoading] = useState(false);
    const [mapList, setMapList] = useState([]);
    const [digest, setDigest] = useState('');
    const [message, setMessage] = useState('');

    const {mutate: signAndExecuteTransaction} = useSignAndExecuteTransaction();

    // 配置信息
    const env = import.meta.env;
    const MARKET_PACKAGE_ID = env.VITE_MARKET_PACKAGE_ID;       // 合约
    const MAPS_TABLE_ID = env.VITE_MAPS_TABLE_ID;        // data: Table<u64, Map>
    const MAPS_OBJECT_ID = env.VITE_MAPS_OBJECT_ID;                   // public struct Maps has key, store

    const defaultMapArray: number[][] = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

    const handleRestart = () => {
        console.log('reset game map manage', account);
        setIsLoading(false);
    };

    const handleCreateMaps = (name, description, url) => {
        const tb = new Transaction();
        tb.setSender(account?.address);

        tb.moveCall({
            target: `${MARKET_PACKAGE_ID}::market::create_maps`,
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
                    console.log('executed transaction', result);
                    setDigest(result.digest);
                },
                onError: (result) => {
                    console.log('trans error', result.message);
                    setMessage(result.message);
                }
            },
        );

    }

    const handleSaveMapData = (map_object) => {
        console.log('handleSaveMapData', map_object);
        // console.log('address', account?.address);
        // console.log('maps id', MAPS_OBJECT_ID);
        // console.log('index', map_object.index);
        // console.log('data', map_object.data);

        const tb = new Transaction();
        tb.setSender(account?.address);

        tb.moveCall({
            target: `${MARKET_PACKAGE_ID}::market::update_map_data`,
            arguments: [
                tb.object(map_object.manager_id),                                 // maps: &mut Maps
                tb.pure.u64(map_object.index),                      // index: u64
                tb.pure('vector<vector<u8>>', map_object.data),     // data: vector<vector<u8>>
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
                },
                onError: (result) => {
                    console.log('trans error', result.message);
                    setMessage(result.message);
                }
            },
        );
    }

    const handleAddMap = async (pushbox_id, index, map_array) => {
        console.log('add map');
        console.log('address', account?.address);
        console.log('pushbox id', pushbox_id);
        console.log('index', index);
        console.log('data', map_array);

        const tb = new Transaction();
        tb.setSender(account?.address);

        tb.moveCall({
            target: `${MARKET_PACKAGE_ID}::market::add_map`,
            arguments: [
                tb.object(pushbox_id),                             // maps: &mut Maps
                tb.pure('vector<vector<u8>>', map_array),       // data: vector<vector<u8>>
            ],
        });

        // 将PTB签名上链
        signAndExecuteTransaction(
            {
                transaction: tb,
            },
            {
                onSuccess: (result) => {
                    console.log('executed transaction', result);
                    setDigest(result.digest);
                },
                onError: (result) => {
                    console.log('trans error', result.message);
                    setMessage(result.message);
                }
            },
        );
    }

    const getMapList = async (pushbox_id:string) => {
        setIsLoading(true);
        console.log('get map list', pushbox_id);
        const tempList = [];

        // 读取列表
        const res = await suiClient.getObject({
            id: pushbox_id,
            options: {
                showContent: true,
            }
        })

        const base = res.data.content.fields as PushBoxOnChain;
        // console.log('PushBox object', base);
        for (const index in base.maps) {
            const item = base.maps[index];
            // console.log('item', item);
            const {fields} = item;
            const map = fields as unknown as MapOnChain;
            map.manager_id = pushbox_id;
            map.index = parseInt(index);
            tempList.push(map);
        }

        setIsLoading(false);

        return tempList;
    }

    const getMapObject = async (id: string) => {
        const res = await suiClient.getObject({
            id,
            options: {
                showContent: true,
            }
        })

        const base = res.data.content.fields;
        // console.log('base object', base);
        const mapObject = base?.value as SuiMoveObject;
        const {fields} = mapObject;

        return fields as unknown as MapOnChain;
    }

    const getPushBoxObject = async (id: string) => {
        const res = await suiClient.getObject({
            id,
            options: {
                showContent: true,
                // showOwner: true,
            }
        })

        // console.log('res object', res);
        const base = res.data.content.fields as PushBoxOnChain;
        console.log('base object', base);
        return base;
    }

    const getManageObject = async (id: string) => {
        const res = await suiClient.getObject({
            id,
            options: {
                showContent: true,
            }
        })

        const base = res.data.content.fields as ManageOnChain;
        const {fields: record} = base.record;
        record.step = parseInt(record.step)
        record.time = parseInt(record.time)
        base.record = record;
        // console.log('Manage object', base);

        return base;
    }

    const handelPayForUpdateRecord = (manager_id: string, nickname: string, time: number, step: number, handlePaySuccess, handlePayError) => {
        console.log('manager_id', manager_id);
        console.log('nickname', nickname);
        console.log('time', time);
        console.log('step', step);

        // callback();
        // return
        const tb = new Transaction();
        tb.setSender(account?.address);
        const payment = tb.splitCoins(tb.gas, [1000000]);

        tb.moveCall({
            target: `${MARKET_PACKAGE_ID}::manage::update_record`,
            arguments: [
                tb.object(manager_id),
                payment,
                tb.pure.string(nickname),
                tb.pure.u64(time),
                tb.pure.u64(step),
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
                    handlePaySuccess();
                },
                onError: (result) => {
                    console.log('trans error', result.message);
                    handlePayError(result);
                }
            },
        );

    }

    // useEffect(() => {
    //     handleRestart();
    // }, [account]);

    return {
        defaultMapArray,
        isLoading,
        mapList,
        digest,
        message,
        getMapList,
        getPushBoxObject,
        getManageObject,
        handleRestart,
        handleCreateMaps,
        handleAddMap,
        handleSaveMapData,
        handelPayForUpdateRecord,
    }

}