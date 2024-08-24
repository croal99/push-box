import {Button, Container, Flex} from "@radix-ui/themes";
import {useSetup} from "@/hooks/useSetup.ts";
import {usePlayground} from "@/hooks/usePlayground.ts";

export function GameManage({}) {
    const {handleCreatePlayground} = usePlayground();
    const {handleInitManager, handleInitMaps} = useSetup();

    const create_playground = () => {
        handleCreatePlayground("PlayGround", "Super Play Ground", "https://image0.lietou-static.com/img/603c802560e5677feb2a62b906u.png")
    }

    const init_manager = () => {
        handleInitManager("Sokoban", "Level", "https://img1.baidu.com/it/u=1175345804,745978986&fm=253&fmt=auto&app=138&f=JPG?w=500&h=500", handleSuccess, handleError);
    }

    const init_map = () => {
        handleInitMaps()
    }

    return (
        <>
            <Container mt="5" pt="2" px="4">
                <Flex gap="3">
                    <Button onClick={create_playground}>Create Playground</Button>
                    <Button onClick={init_manager}>Init Manager</Button>
                    <Button onClick={init_map}>Init Map</Button>
                </Flex>
            </Container>
        </>
    )
}