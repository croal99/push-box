import {Box, Button, Card, Dialog, Flex, Inset, Strong, Text} from "@radix-ui/themes";
import {ManageOnChain} from "@/types/ManageOnChain.ts";

export function ManagerInfo(
    {
        manager,
        handlePlayGame,
    }) {
    return (
        <>
            <Box maxWidth="240px">
                <Card size="2" className="game-icon">
                    <Inset clip="padding-box" side="top" pb="current">
                        <img
                            src={manager.url}
                            alt={manager.name}
                            style={{
                                display: 'block',
                                objectFit: 'cover',
                                width: '100%',
                                height: 240,
                                backgroundColor: 'var(--gray-5)',
                            }}
                        />
                    </Inset>
                    <Flex direction="column" gap="2">
                        <Text as="p" size="3" align="center">
                            <Strong>{manager.name}</Strong>
                        </Text>

                        <Text as="div" size="2" mb="1" weight="bold">
                            {manager.description}
                        </Text>

                        <Text as="div" size="2" mb="1" weight="bold">
                            Fee: {manager.fee / 1000000000} Sui
                        </Text>

                        <Text as="div" size="2" mb="1">
                            Best record: [{manager.record.nickname}]
                        </Text>

                        <Text as="div" size="2" mb="1">
                            Maps: [{manager.maps_count}]
                        </Text>


                        <Dialog.Root>
                            <Dialog.Trigger>
                                <Button>Play</Button>
                            </Dialog.Trigger>

                            <Dialog.Content maxWidth="450px">
                                <Dialog.Title>{manager.name}</Dialog.Title>
                                <Dialog.Description size="2" mb="4">
                                    {manager.description}
                                </Dialog.Description>

                                <Flex direction="column" gap="3">
                                    <label>
                                        <Text as="div" size="2" mb="1" weight="bold">
                                            Fee: {manager.fee / 1000000000} Sui
                                        </Text>
                                    </label>
                                    <label>
                                        <Text as="div" size="2" mb="1">
                                            Best record: [{manager.record.nickname}]
                                        </Text>
                                    </label>
                                    <label>
                                        <Text as="div" size="2" mb="1">
                                            {manager.record.time < 1000000 ?
                                                <>time: {manager.record.time} second </> :
                                                <>time: wait for you</>}
                                        </Text>

                                    </label>

                                    <label>
                                        <Text as="div" size="2" mb="1">
                                            {manager.record.step < 1000000 ?
                                                <>step: {manager.record.step} </> :
                                                <>step: wait for you</>}
                                        </Text>

                                    </label>
                                </Flex>

                                <Flex gap="3" mt="4" justify="end">
                                    <Dialog.Close>
                                        <Button variant="soft" color="gray">
                                            Cancel
                                        </Button>
                                    </Dialog.Close>
                                    <Dialog.Close>
                                        <Button onClick={() => handlePlayGame(manager)}>Pay and Play</Button>
                                    </Dialog.Close>
                                </Flex>
                            </Dialog.Content>
                        </Dialog.Root>
                    </Flex>

                </Card>
            </Box>
        </>
    )
}