import {Button, Flex, Switch, Table} from "@radix-ui/themes";
import {useEffect, useState} from "react";
import {MapEdit} from "@/components/map/MapEdit.tsx";

export function MapTable(
    {
        map_list,
        managerID,
        handleSaveMapData
    }) {

    const [isEditMapData, setIsEditMapData] = useState(false);
    const [mapObject, setMapObject] = useState({});

    const edit_map = (index, map_object) => {
        console.log('edit map object', map_object);
        setMapObject(map_object);
        setIsEditMapData(true);
    }

    const onSaveMapData = () => {
        setIsEditMapData(false);
    }

    useEffect(() => {
    }, []);

    if (isEditMapData) {
        return <MapEdit
            map={mapObject}
            managerID={managerID}
            handleSaveMapData={handleSaveMapData}
            onSaveMap={onSaveMapData}
        />
    }

    return (
        <>
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
                    {map_list.map((item, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>{item.level}</Table.Cell>
                            <Table.Cell>{item.reset}</Table.Cell>
                            <Table.Cell>{item.time}</Table.Cell>
                            <Table.Cell><Switch checked={item.enable} data-disable={true}/></Table.Cell>
                            <Table.Cell>
                                {/*<Button onClick={() => edit_map(index, item)}>Edit</Button>*/}
                                <MapEdit/>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </>
    )
}