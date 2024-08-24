import {Button, Flex, Switch, Table} from "@radix-ui/themes";
import {useEffect, useState} from "react";
import {useManager} from "@/hooks/useManager.ts";

export function PlayerTable(
    {
        player_list,
    }
) {
    const {defaultMapArray, handleAddMapByID} = useManager();

    useEffect(() => {
    }, []);

    const edit_player = (record_id) => {
        console.log('edit player', record_id);
        handleAddMapByID(record_id, 2, defaultMapArray).then(()=>{
            console.log('add end');
        });
    }

    return (
        <>
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>序号</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Nickname</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>操作</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {player_list.map((item, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>{item.nickname}</Table.Cell>
                            <Table.Cell>{item.record_id}</Table.Cell>
                            <Table.Cell>
                                <Button onClick={() => edit_player(item.record_id)}>Edit</Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </>
    )

}