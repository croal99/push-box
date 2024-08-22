import {useState} from "react";
import {Button, Container, Flex} from "@radix-ui/themes";
import {PlayerTable} from "@/components/setup/PlayerTable.tsx";

export function GameManage(
    {
        isManagerLoading,
        playerList,
        getPlayerList,
        handleCreateManager,
        handleJoinGame,
    }) {
    const [map_name, setMapName] = useState("FirstMap");
    const [description, setDescription] = useState("First Push-BOX Maps");
    const [url, setUrl] = useState("https://");
    const [isShowPlayerList, setShowPlayerList] = useState(false);

    const create_manage = () => {
        handleCreateManager("manage", "manager", "https://");
    }

    const join_game = () => {
        handleJoinGame("nickname");
    }

    const get_player_list = () => {
        getPlayerList();
        setShowPlayerList(true);
    }

    if (isManagerLoading) {
        return <Flex>Loading...</Flex>;
    }

    if (isShowPlayerList) {
        return <PlayerTable
            player_list={playerList}
            />
    }

    return (
        <>
            <Container mt="5" pt="2" px="4">
                <Flex gap="3">
                    <Button onClick={create_manage}>Create Manger</Button>
                    <Button onClick={join_game}>Join game</Button>
                    <Button onClick={get_player_list}>Get player list</Button>

                </Flex>
            </Container>
        </>
    )
}