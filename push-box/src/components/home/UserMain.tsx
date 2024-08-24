import {PushBoxHeader} from "@/components/home/PushBoxHeader.tsx";
import {Box, Button, Card, Container, Dialog, Flex, Grid, Inset, Spinner, Strong, Tabs, Text} from "@radix-ui/themes";
import {UserNavigation} from "@/components/home/UserNavigation.tsx";
import {UserStatus} from "@/components/home/UserStatus.tsx";
import {PlayerList} from "@/components/setup/PlayerList.tsx";
import {useEffect, useState} from "react";
import {MapOnChain} from "@/types/MapOnChain.ts";
import {PlayGame} from "@/components/home/PlayGame.tsx";
import {PlayerOnChain} from "@/types/PlayerOnChain.ts";
import {JoinGame} from "@/components/home/JoinGame.tsx";
import {ManageOnChain} from "@/types/ManageOnChain.ts";
import {ManagerInfo} from "@/components/home/ManagerInfo.tsx";
import {PushBoxOnChain} from "@/types/PushBoxOnChain.ts";

export function UserMain(
    {
        getMapList,
        getPlayer,
        getPlayerList,
        getManagerList,
        getManageObject,
        getPushBoxObject,
        handleJoinGame,
        handelPayForUpdateRecord,
        handlePayAndPlayGame,
        setBack,
    }) {
    const [playManager, setPlayManager] = useState<ManageOnChain | null>(null);
    const [playMaps, setPlayMaps] = useState<[MapOnChain]>([]);
    const [managerList, setManagerList] = useState<ManageOnChain[]>([]);
    const [playerList, setPlayerList] = useState<PlayerOnChain[] | []>([]);
    const [player, setPlayer] = useState<PlayerOnChain | boolean>(false);
    const [isLoading, setIsLoading] = useState(false);

    // 配置信息
    const env = import.meta.env;
    const PLAYGROUND_ID = env.VITE_PLAYGROUND_ID;

    const play_game = (manager: ManageOnChain) => {
        // console.log('play game', manager);
        handlePayAndPlayGame(manager, handlePaySuccess, handlePayError);
    }

    const handlePaySuccess = (manager) => {
        setPlayManager(manager);
        getPushBoxObject(manager.config_id).then((config: PushBoxOnChain) => {
            // console.log('config object', config)
            const tempList = []
            config.maps.map((item, index) => {
                // console.log(index, item)
                const {fields: map_object} = item
                tempList.push(map_object)
            })
            setPlayMaps(tempList);
        })
    }

    const handlePayError = (result) => {
        console.log('trans error', result.message);
    }

    const close_game = async () => {
        console.log('close game')
        await fetchData();
    }

    const fetchData = async () => {
        console.log('fetch data');
        setPlayMaps([]);
        setIsLoading(true);
        try {
            const manager_list = await getManagerList(PLAYGROUND_ID);
            // console.log('manager list', manager_list);
            setManagerList(manager_list);
        } catch (error) {
            console.log('error', error)
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData().then(() => {
            console.log('end fetch')
        });

        return () => {
            console.log("UserMain uninstall")
        }
    }, []);

    if (isLoading) {
        return (
            <Box className="back-image">
                <Box className="login-container">
                    <Card size="3">
                        <Button>
                            <Spinner loading>
                            </Spinner>
                            Loading...
                        </Button>
                    </Card>
                </Box>
            </Box>
        )
    }

    // 当前游戏
    if (playMaps.length > 0) {
        return (
            <Box className="back-image">
                <PushBoxHeader></PushBoxHeader>
                <PlayGame
                    playMaps={playMaps}
                    playManager={playManager}
                    handelPayForUpdateRecord={handelPayForUpdateRecord}
                    setBack={close_game}
                />
            </Box>
        );
    }
    return (
        <>
            <Box className="back-image" pt="4" px="4">
                <Box pt="4" px="4" style={{background: "var(--gray-a2)", minHeight: 800}}>
                    <Grid columns="5" gap="4">
                        {managerList.map((item, index) =>

                            <ManagerInfo
                                key={index}
                                manager={item}
                                handlePlayGame={play_game}
                            />
                        )}

                    </Grid>
                </Box>
            </Box>
        </>
    )


}