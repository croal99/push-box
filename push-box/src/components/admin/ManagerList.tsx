import {
    Box,
    Button,
    Card,
    Dialog,
    Flex,
    Inset,
    Strong,
    Text,
    Select,
    Container,
    Grid,
    TextField, Spinner
} from "@radix-ui/themes";
import {useEffect, useState} from "react";
import {MapOnChain} from "@/types/MapOnChain.ts";
import {ManageOnChain} from "@/types/ManageOnChain.ts";
import {useCurrentAccount} from "@mysten/dapp-kit";
import {usePlayground} from "@/hooks/usePlayground.ts";
import {useManager} from "@/hooks/useManager.ts";


export function ManagerList(
    {
        getManagerList,
        handleSetManagerID,
        setBack,
    }) {
    const account = useCurrentAccount();
    const {handleCreateManager} = usePlayground()
    const {handleAddMap} = useManager()

    const [managerList, setManagerList] = useState<ManageOnChain[]>([]);
    const [managerId, setManagerID] = useState('');
    const [managerObject, setManagerObject] = useState<ManageOnChain>({} as ManageOnChain);
    const [isLoading, setIsLoading] = useState(true);

    // 配置信息
    const env = import.meta.env;
    const PLAYGROUND_ID = env.VITE_PLAYGROUND_ID;

    const fetchData = async () => {
        console.log('fetch data')
        setIsLoading(true);

        const manager_list = await getManagerList(PLAYGROUND_ID);
        // console.log(manager_list)

        // 用户判断
        const tempList = [];
        for (const key in manager_list) {
            const manager = manager_list[key] as ManageOnChain;
            // console.log(manager, account?.address);
            if (manager.owner === account?.address) {
                tempList.push(manager);
            }
        }
        // console.log(tempList);
        setManagerList(tempList);

        setIsLoading(false);
    };

    useEffect(() => {
        // console.log('ManagerList');
        fetchData().then(() => {
            console.log('end fetch');
        });

    }, []);

    const set_current_manageId = (id) => {
        // console.log(id);
        setManagerID(id);
        handleSetManagerID(id);
    }

    const create_manger = () => {
        // console.log(managerObject);
        setIsLoading(true);
        handleCreateManager(managerObject.name, managerObject.description, managerObject.url, handelSuccess, handleError)
        setIsLoading(false);
    }

    const create_map = () => {
        setIsLoading(true);
        handleAddMap(managerId);
        setIsLoading(false);

    }

    const handelSuccess = (result) => {
        console.log(result)
        fetchData().then(() => {
            console.log('reFetch')
        })
    }

    const handleError = (result) => {
        console.log(result)
    }

    if (isLoading) {
        return (
            <>
                <Box className="login-container">
                    <Card size="3">
                        <Button>
                            <Spinner loading>
                            </Spinner>
                            Loading...
                        </Button>
                    </Card>
                </Box>
            </>
        )
    }

    return (
        <>
            <Container>
                <Flex gap="4">
                    <Box px="4">
                        <Text>Your game:</Text>
                    </Box>
                    <Grid columns="1" width="300px">
                        <Select.Root onValueChange={set_current_manageId}>
                            <Select.Trigger/>
                            <Select.Content>
                                <Select.Group>
                                    {managerList.map((item, index) => (
                                        <Select.Item value={item.config_id}
                                                     key={index}>{item.name}-{item.description}</Select.Item>
                                    ))}
                                </Select.Group>
                            </Select.Content>
                        </Select.Root>
                    </Grid>
                    <Dialog.Root>
                        <Dialog.Trigger>
                            <Button style={{width: 120}}>Add Game</Button>
                        </Dialog.Trigger>

                        <Dialog.Content maxWidth="450px">
                            <Dialog.Title>Create Sokoban map config</Dialog.Title>
                            <Dialog.Description size="2" mb="4">

                            </Dialog.Description>

                            <Flex direction="column" gap="3">
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">
                                        Name:
                                    </Text>

                                    <TextField.Root
                                        placeholder="Enter name"
                                        onChange={e => {
                                            managerObject.name = e.target.value;
                                        }}
                                    />
                                </label>
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">
                                        description:
                                    </Text>

                                    <TextField.Root
                                        placeholder="Enter description"
                                        onChange={e => {
                                            managerObject.description = e.target.value;
                                        }}
                                    />
                                </label>
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">
                                        url:
                                    </Text>

                                    <TextField.Root
                                        placeholder="Enter url"
                                        onChange={e => {
                                            managerObject.url = e.target.value;
                                        }}
                                    />
                                </label>
                            </Flex>

                            <Flex gap="3" mt="4" justify="end">
                                <Dialog.Close>
                                    <Button variant="soft" color="gray">
                                        Cancel
                                    </Button>
                                </Dialog.Close>
                                <Dialog.Close>
                                    <Button onClick={create_manger}>Create</Button>
                                </Dialog.Close>
                            </Flex>
                        </Dialog.Content>
                    </Dialog.Root>
                    <Button onClick={create_map} style={{width: 120}}>Add Map</Button>
                    <Button onClick={() => setBack(false)} style={{width: 120}}>Exit</Button>
                </Flex>
            </Container>
        </>
    );
}