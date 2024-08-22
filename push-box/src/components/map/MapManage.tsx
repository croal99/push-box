// notes
import {useCurrentAccount, ConnectButton, useSuiClientQuery, useSignAndExecuteTransaction} from "@mysten/dapp-kit";
import {useEffect, useState} from "react";
import {Box, Button, Container, Flex, Heading, Dialog, Text, TextField, Card, Grid, Spinner} from "@radix-ui/themes";
import {useSui} from "@/hooks/useSui";
import {Transaction} from "@mysten/sui/transactions";
import * as Label from "@radix-ui/react-label";
import * as Toast from '@radix-ui/react-toast';
import * as Form from '@radix-ui/react-form';

import {MapEdit} from "@/components/map/MapEdit.tsx";
import {MapTable} from "@/components/map/MapTable.tsx";
import {MapOnChain} from "@/types/MapOnChain.ts";

export function MapManage(
    {
        managerID,
        getMapList,
        handleAddMap,
        handleSaveMapData,
        setBack,
    }) {
    const {mutate: signAndExecuteTransaction} = useSignAndExecuteTransaction();
    const [map_name, setMapName] = useState("FirstMap");
    const [description, setDescription] = useState("First Push-BOX Maps");
    const [url, setUrl] = useState("https://");
    const [mapList, setMapList] = useState<MapOnChain[]>([]);
    const [isMapLoading, setIsMapLoading] = useState(false);

    const fetchData = async () => {
        console.log('fetch data');
        setIsMapLoading(true);
        try {
            const maps = await getMapList(managerID);
            setMapList(maps);
        } catch (error) {
            console.log('error', error)
        }
        setIsMapLoading(false);
    };

    useEffect(() => {
        console.log('Map manage');
        fetchData().then(() => {
            console.log('end fetch');
        });

    }, []);

    const init_map_array: number[][] = [
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


    // const create_maps = () => {
    //     console.log('name', map_name)
    //     console.log('description', description)
    //     console.log('url', url)
    //     handleCreateMaps(map_name, description, url);
    // }

    const add_map = () => {
        // console.log('size', mapList.length);
        return handleAddMap(managerID, mapList.length, init_map_array);
    }

    if (isMapLoading) {
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

    return (
        <Box className="back-image">
            <Container>
                <Box px="3">
                    <Flex gap="3">
                        <Button onClick={add_map}>Add map</Button>
                        <Button onClick={fetchData}>Refresh</Button>
                        <Button onClick={() => setBack(false)}>Close</Button>

                    </Flex>
                    <Flex direction="column" my="2">
                        <Card>
                            <MapTable
                                map_list={mapList}
                                managerID={managerID}
                                handleSaveMapData={handleSaveMapData}
                            />

                        </Card>
                    </Flex>

                </Box>
            </Container>
        </Box>
    )
}