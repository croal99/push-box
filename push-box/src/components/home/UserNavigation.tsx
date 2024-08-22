import {Box, Button, Container, Flex, Heading, Dialog, Text, TextField, Card, Avatar, Link} from "@radix-ui/themes";
import {useEffect, useState} from "react";
import {MapOnChain} from "@/types/MapOnChain.ts";

export function UserNavigation(
    {
        mapList,
        selectMap,
        setBack,
    }) {


    return (
        <Flex direction="column" my="2" gap="3">
            {mapList.map((item, index) => (
                <Button onClick={() => selectMap(item)} key={index}>Play map {index}</Button>
            ))}
            <Button onClick={() => setBack(false)}>Return</Button>
        </Flex>
    )
}