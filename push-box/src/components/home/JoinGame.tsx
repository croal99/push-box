import {useState} from "react";
import {Box, Button, Card, Container, Dialog, Flex, Grid, Text, TextField} from "@radix-ui/themes";
import {ConnectButton} from "@mysten/dapp-kit";

export function JoinGame(
    {
        handleJoinGame,
        setBack,
    }) {
    const [nickname, setNickname] = useState("");

    const join_game = () => {
        if (nickname.length == 0) return;
        handleJoinGame(nickname);
    }

    return (
        <Box className="back-image">
            <Box className="login-container">
                <Card className="login-form">
                    <Flex direction="column" gap="3">
                        <Text as="div" weight="bold" size="3" mb="1">
                            This is your first time joining the game, <br/>please input your nickname.
                        </Text>
                        <label>
                            <TextField.Root
                                value={nickname}
                                placeholder="Enter nickname"
                                onChange={e => {
                                    setNickname(e.target.value);
                                }}
                            />
                        </label>

                        <Flex gap="3" mt="4" justify="end">
                            <Button onClick={join_game}>Join game</Button>
                            <Button variant="surface" onClick={() => setBack(false)}>Back</Button>
                        </Flex>
                    </Flex>
                </Card>
            </Box>
        </Box>
    )
}