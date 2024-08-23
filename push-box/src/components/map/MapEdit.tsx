import {Button, Container, Flex, Dialog, TextField, Text, Grid, Switch} from "@radix-ui/themes";
import {useEffect, useState} from "react";
import {useManager} from "@/hooks/useManager.ts";
import {MapOnChain} from "@/types/MapOnChain.ts";


export function MapEdit(
    {
        map,
    }) {
    const [level, setLevel] = useState(0);
    const [time, setTime] = useState(0);
    const [reset, setReset] = useState(0);
    const [enable, setEnable] = useState(false);
    const [map_string, setMapString] = useState('');
    const [mapObject, setMapObject] = useState<MapOnChain | null>(null);

    const {handleSaveMapData} = useManager();

    useEffect(() => {
        // console.log('map object', map);
        setMapObject(map)
        setLevel(map.level);
        setTime(map.time);
        setReset(map.reset);
        setEnable(map.enable);
        init_map_string(map.data);
    }, [map]);

    const init_map_string = (map_array: number[][]) => {
        let temp_string = '';

        for (let i = 0; i < map_array.length; i++) {
            temp_string += map_array[i].join('') + '\n'
        }

        setMapString(temp_string);
    }

    const save_map = () => {
        let tempMap: number[][] = [];
        let map_lines = map_string.trim().split(/\r?\n/);

        // 检查数据完整性
        // console.log('map length', map_lines.length, map_lines);
        if (map_lines.length != 16) {
            alert('地图数据错误');
            return;
        }

        for (let i = 0; i < map_lines.length; i++) {
            let line_array = map_lines[i].split("");
            let tempRow: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (let j = 0; j < line_array.length; j++) {
                tempRow[j] = parseInt(line_array[j]);
            }
            tempMap.push(tempRow);
        }

        // console.log(tempMap);
        map.level = level;
        map.time = time;
        map.reset = reset;
        map.enable = enable;
        map.data = tempMap;
        handleSaveMapData(mapObject);
    }

    const onEdit = () => {
        // console.log('on edit', map);
    }

    return (
        <>
            <Dialog.Root>
                <Dialog.Trigger>
                    <Button onClick={onEdit}>Edit config</Button>
                </Dialog.Trigger>

                <Dialog.Content maxWidth="460px">
                    <Dialog.Title>Edit map config</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                        Make changes to your map.
                    </Dialog.Description>

                    <Flex direction="column" gap="6">
                        <Grid columns="2" gap="6">
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    难度等级
                                </Text>

                                <TextField.Root
                                    value={level}
                                    placeholder="Enter level"
                                    onChange={e => {
                                        setLevel(parseInt(e.target.value));
                                    }}
                                />
                            </label>
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    通关时限
                                </Text>

                                <TextField.Root
                                    value={time}
                                    placeholder="Enter level"
                                    onChange={e => {
                                        setTime(parseInt(e.target.value));
                                    }}
                                />
                            </label>
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    重玩次数
                                </Text>

                                <TextField.Root
                                    value={reset}
                                    placeholder="Enter level"
                                    onChange={e => {
                                        setReset(parseInt(e.target.value));
                                    }}
                                />
                            </label>
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    是否启用
                                </Text>
                                <Switch
                                    checked={enable}
                                    onCheckedChange={setEnable}
                                />
                            </label>

                        </Grid>
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                地图数据(0:地板 1:墙壁 2:终点 3:箱子 4:小人)
                            </Text>
                            <textarea rows={18} value={map_string} cols={50}
                                      onChange={event => {
                                          const filteredValue = event.target.value.replace(/[\[\] ,]/g, '');
                                          setMapString(filteredValue);
                                      }}>
                            </textarea>
                        </label>
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray">
                                Cancel
                            </Button>
                        </Dialog.Close>
                        <Dialog.Close>
                            <Button onClick={save_map}>Save</Button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>

        </>
    )
}