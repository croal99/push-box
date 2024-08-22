import {Button, Container, Flex} from "@radix-ui/themes";
import {useEffect, useState} from "react";


export function MapEdit(
    {
        map,
        handleSaveMapData,
        onSaveMap
    }) {
    const [map_string, setMapString] = useState('');
    const [mapObject, setMapObject] = useState({});

    useEffect(() => {
        console.log('map object', map);
        setMapObject(map)
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
        mapObject.data = tempMap;
        handleSaveMapData(mapObject);
        onSaveMap();
    }


    return (
        <>
            <Flex justify={"center"}>
            </Flex>
            <Container mt="5" pt="2" px="4">
                <Flex gap="3" direction={"column"}>
                    <textarea rows={18} value={map_string}
                              onChange={event => {
                                  const filteredValue = event.target.value.replace(/[\[\] ,]/g, '');
                                  setMapString(filteredValue);
                              }}>

                    </textarea>
                    <Button onClick={save_map}>Save</Button>
                    <Button onClick={onSaveMap}>Return</Button>
                </Flex>
            </Container>
        </>
    )
}