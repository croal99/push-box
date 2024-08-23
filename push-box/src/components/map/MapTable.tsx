import {Box, Button, Card, Container, Flex, Spinner, Switch, Table} from "@radix-ui/themes";
import {useEffect, useState} from "react";
import {MapEdit} from "@/components/map/MapEdit.tsx";
import {MapOnChain} from "@/types/MapOnChain.ts";
import {useManager} from "@/hooks/useManager.ts";

export function MapTable(
    {
        managerID,
        handleSaveMapData
    }) {
    const [isEditMapData, setIsEditMapData] = useState(false);
    const [mapObject, setMapObject] = useState({});
    const [mapList, setMapList] = useState<MapOnChain[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const {getMapList} = useManager()

    const fetchData = async () => {
        // console.log('fetch data', managerID);
        if (managerID === '') {
            return;
        }
        setIsLoading(true);

        const maps = await getMapList(managerID);
        setMapList(maps);

        setIsLoading(false);
    };

    useEffect(() => {
        console.log('Map manage');
        fetchData().then(() => {
            console.log('end fetch');
        });

    }, [managerID]);

    if (isLoading) {
        return (
            <>
                <Box className="login-container">
                    <Card size="3">
                        <Button>
                            <Spinner loading>
                            </Spinner>
                            Loading Map List...
                        </Button>
                    </Card>
                </Box>
            </>
        )
    }

    return (
        <>
            <Container>
                <Box px="3" gap="4">
                    <Card>
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>序号</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>难度等级</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>通关时间</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>重玩次数</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>是否启用</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>操作</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {mapList.map((item, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{item.level}</Table.Cell>
                                        <Table.Cell>{item.reset}</Table.Cell>
                                        <Table.Cell>{item.time}</Table.Cell>
                                        <Table.Cell><Switch checked={item.enable} data-disable={true}/></Table.Cell>
                                        <Table.Cell>
                                            <MapEdit
                                                map={item}
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>

                    </Card>
                </Box>
            </Container>
        </>
    )
}