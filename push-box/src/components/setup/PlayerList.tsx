import {Avatar, Box, Button, Card, Flex, Text, Table} from "@radix-ui/themes";
import {useEffect, useState} from "react";
import {useManager} from "@/hooks/useManager.ts";

export function PlayerList(
    {
        playerList,
    }) {

    useEffect(() => {
    }, []);

    return (
        <Flex  gap="3" direction="column">
            {playerList.map((item, index) => (
                <Box width="240px" key={index}>
                    <Card>
                        <Flex gap="3" align="center">
                            <Avatar
                                size="3"
                                src="images/default.png"
                                radius="full"
                                fallback="T"
                            />
                            <Box>
                                <Text as="div" size="2" weight="bold">
                                    {item.nickname}
                                </Text>
                                <Text as="div" size="2" color="gray">
                                    Score: 1000
                                </Text>
                            </Box>
                        </Flex>
                    </Card>
                </Box>
            ))
            }
        </Flex>
    )
}
