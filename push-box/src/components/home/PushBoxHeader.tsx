import {Box, Flex, Heading} from "@radix-ui/themes";
import {ConnectButton} from "@mysten/dapp-kit";

export function PushBoxHeader() {
    return (
        <Flex
            position="sticky"
            px="4"
            py="2"
            justify="between"
            style={{
                borderBottom: "1px solid var(--gray-a2)",
            }}
        >
            <Box>
                <Heading>Let's push on Sui!</Heading>
            </Box>

            <Box>
                <ConnectButton/>
            </Box>
        </Flex>
    )
}