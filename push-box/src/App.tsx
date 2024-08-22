import {ConnectButton, useCurrentAccount} from "@mysten/dapp-kit";
import {
    Box,
    Button,
    Card,
    Container,
    Flex,
    Grid,
    Heading,
    TextArea,
    Text,
    Spinner,
    Strong,
    Inset, Dialog, TextField
} from "@radix-ui/themes";

import {PlayGame} from "./components/home/PlayGame.tsx";
import {SiginInBanner} from "./components/home/SiginInBanner.tsx";

import {usePlayerManage} from "@/hooks/usePlayerManage.ts";
import {useManager} from "@/hooks/useManager.ts";


import {useEffect, useState} from "react";
import {MapManage} from "@/components/map/MapManage.tsx";
import {GameManage} from "@/components/setup/GameManage.tsx";
import {usePlayground} from "@/hooks/usePlayground.ts";
import {PlayerList} from "@/components/setup/PlayerList.tsx";
import {JoinGame} from "@/components/home/JoinGame.tsx";
import {PlayerOnChain} from "@/types/PlayerOnChain.ts";
import {PushBoxHeader} from "@/components/home/PushBoxHeader.tsx";
import {UserNavigation} from "@/components/home/UserNavigation.tsx";
import {UserStatus} from "@/components/home/UserStatus.tsx";
import {UserMain} from "@/components/home/UserMain.tsx";
import {useSetup} from "@/hooks/useSetup.ts";

let level = 0;

function App() {
    const account = useCurrentAccount();
    const address = account?.address;
    const [playground, setPlayground] = useState<PlayerOnChain | boolean>(false);
    const [managerList, setManagerList] = useState<string[] | boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSignIn, setIsSignIn] = useState(false);
    const [isPayGame, setIsPayGame] = useState(false);
    const [isAdminSignIn, setIsAdminSignIn] = useState(false);

    // 配置信息
    const env = import.meta.env;
    const PLAYGROUND_ID = env.VITE_PLAYGROUND_ID;
    const TEST_GAME_CONFIG_OBJECT_ID = env.VITE_TEST_GAME_CONFIG_OBJECT_ID;

    const {
        handleInitManager,
        handleInitMaps,
    } = useSetup();

    const {
        isLoading: isManagerLoading,
        handleCreatePlayground,
        getPlaygroundObject,
        handleCreateManager,
        getManagerList,
        handleJoinGame,
        handlePayAndPlayGame,
    } = usePlayground();

    const {
        isLoading: isPlayerLoading,
        getPlayer,
        getPlayerList,
    } = usePlayerManage();

    const {
        isLoading: isMapLoading,
        mapList,
        message,
        getMapList,
        getPushBoxObject,
        getManageObject,
        handleCreateMaps,
        handleAddMap,
        handleSaveMapData,
        handelPayForUpdateRecord,
    } = useManager();

    const fetchData = async () => {
        console.log('fetch data');
        setIsLoading(true);
        try {
            const playground = await getPlaygroundObject(PLAYGROUND_ID);
            setPlayground(playground);
        } catch (error) {
            console.log('error', error)
        }
        setIsLoading(false);
    };

    useEffect(() => {
        console.log('init application');
        if (!account) {
            console.log("no account")
            return () => {
                console.log("uninstall application 1")
            }
        }
        fetchData().then(() => {
            console.log('end fetch');
        });

        return () => {
            console.log("uninstall application 2")
        }
    }, [account]);

    const pay_for_game = () => {
        console.log('pay OK')
        setIsPayGame(true);
    }

    const create_playground = () => {
        handleCreatePlayground("PlayGround", "Super Play Ground", "https://image0.lietou-static.com/img/603c802560e5677feb2a62b906u.png")
    }

    const create_manager = () => {
        handleCreateManager("Sokoban", "Level 1", "https://img1.baidu.com/it/u=1175345804,745978986&fm=253&fmt=auto&app=138&f=JPG?w=500&h=500", handleSuccess, handleError);
    }

    const init_manager = () => {
        handleInitManager("Sokoban", "Level", "https://img1.baidu.com/it/u=1175345804,745978986&fm=253&fmt=auto&app=138&f=JPG?w=500&h=500", handleSuccess, handleError);
    }

    const init_map = () => {
        handleInitMaps()
    }

    const handleSuccess = (result) => {
        console.log('create manager success', result);
    }

    const handleError = (result) => {
        console.log('create manager error', result.message);
    }

    const set_admin_sign_in = () => {
        setIsAdminSignIn(true);
    }

    if (isSignIn) {
        return <UserMain
            getMapList={getMapList}
            getPlayer={getPlayer}
            getPlayerList={getPlayerList}
            getManageObject={getManageObject}
            getPushBoxObject={getPushBoxObject}
            getManagerList={getManagerList}
            handleJoinGame={handleJoinGame}
            setBack={setIsSignIn}
            handelPayForUpdateRecord={handelPayForUpdateRecord}
            handlePayAndPlayGame={handlePayAndPlayGame}
        />
    }

    if (isAdminSignIn) {
        return <MapManage
            managerID={TEST_GAME_CONFIG_OBJECT_ID}
            mapList={mapList}
            getMapList={getMapList}
            handleCreateMaps={handleCreateMaps}
            handleAddMap={handleAddMap}
            handleSaveMapData={handleSaveMapData}
            setBack={setIsAdminSignIn}
        />;
    }

    // console.log('application', isSignIn, player);
    return (
        <>
            <Box className="back-image">
                <Box className="login-container">
                    <Card className="login-form" style={{background: "var(--gray-a1)", maxWidth: 400}}>
                        <Flex direction="column" gap="3">
                            <Text as="div" weight="bold" size="3" mb="1">
                                Sokoban
                            </Text>
                            <Text>
                                Sokoban is a classic puzzle game renowned for its simple graphics, ingenious level
                                design, and endless fun challenges. In this game, players control a small person
                                navigating a grid-based map consisting of walls,
                                empty spaces, and boxes. The objective is to push all the boxes to their designated
                                target positions.
                            </Text>
                            {account ?
                                <Grid columns="1" gap="2">
                                    <Button onClick={() => {
                                        setIsSignIn(true)
                                    }}>Let's Play on Sui</Button>
                                </Grid>
                                : <ConnectButton/>}
                        </Flex>
                    </Card>
                </Box>
            </Box>
        </>
    )
}

export default App;
