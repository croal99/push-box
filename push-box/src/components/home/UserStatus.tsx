import {useEffect} from "react";
import {ConnectButton} from "@mysten/dapp-kit";
import {Badge, Text, DataList, Flex, Card, IconButton, Link, Box} from "@radix-ui/themes";
import {Label} from "@radix-ui/react-label";
import {CopyIcon} from "@radix-ui/react-icons";

export function UserStatus(
    {
        player
    }) {

    useEffect(() => {
        console.log('UserStatus', player);
    }, []);

    return (
        <Card>
            <Flex direction="column" gap="3">
                <Text as="div" weight="bold" size="7" mb="1">
                    User Status
                </Text>
                <div className="ui form">
                    <DataList.Root>
                        <DataList.Item>
                            <DataList.Label minWidth="88px">Name</DataList.Label>
                            <DataList.Value>{player.nickname}</DataList.Value>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.Label minWidth="88px">Account</DataList.Label>
                            <DataList.Value>
                                vlad@workos.com
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.Label minWidth="88px">Company</DataList.Label>
                            <DataList.Value>
                                <Link target="_blank" href="https://workos.com">
                                    WorkOS
                                </Link>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.Label minWidth="88px">Total pass</DataList.Label>
                            <DataList.Value>
                                {player.total_pass}
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.Label minWidth="88px">Total time</DataList.Label>
                            <DataList.Value>
                                {player.total_time}
                            </DataList.Value>
                        </DataList.Item>
                    </DataList.Root>
                </div>
            </Flex>
        </Card>
    )
}