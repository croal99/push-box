import {Box, Button, Card, Dialog, Flex, Inset, Strong, Text, Select, Container, Grid} from "@radix-ui/themes";
import {useEffect, useState} from "react";
import {MapOnChain} from "@/types/MapOnChain.ts";
import {ManageOnChain} from "@/types/ManageOnChain.ts";


export function ManagerList(
    {
        getManagerList,
        handleSetManagerID,
    }) {
    const [managerList, setManagerList] = useState<ManageOnChain[]>([]);
    const [managerId, setManagerID] = useState('');

    // 配置信息
    const env = import.meta.env;
    const PLAYGROUND_ID = env.VITE_PLAYGROUND_ID;

    const fetchData = async () => {
        const manager_list = await getManagerList(PLAYGROUND_ID);
        // TO-DO: 用户判断
        setManagerList(manager_list);
    };

    useEffect(() => {
        console.log('ManagerList');
        fetchData().then(() => {
            console.log('end fetch');
        });

    }, []);

    const getMaps = (id) => {
        console.log(id);
        setManagerID(id);
        handleSetManagerID(id);
    }

    return (
        <>
            <Container>
                <Flex gap="4">
                    <Box px="4">
                        <Text>Your game:</Text>
                    </Box>
                    <Grid columns="1" width="300px">
                        <Select.Root value={managerId} onValueChange={getMaps}>
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
                            <Button>Create Game</Button>
                        </Dialog.Trigger>

                        <Dialog.Content maxWidth="450px">
                            <Dialog.Title>Create Sokoban map config</Dialog.Title>
                            <Dialog.Description size="2" mb="4">

                            </Dialog.Description>

                            <Flex direction="column" gap="3">
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">
                                    </Text>
                                </label>
                            </Flex>

                            <Flex gap="3" mt="4" justify="end">
                                <Dialog.Close>
                                    <Button >Create</Button>
                                </Dialog.Close>
                            </Flex>
                        </Dialog.Content>
                    </Dialog.Root>
                </Flex>
            </Container>
        </>
    );
}