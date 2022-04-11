import React from 'react'
import {
    Box,
    HStack,
    Center,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react'
import { useTrezor } from '../providers/trezor'

export const BaseLayout: React.FC = ({ children }) => {
    const { error, initiated, activated } = useTrezor()

    if (error) {
        return (
            <HStack h="100vh">
                <Center flexGrow={1} h="100%">
                    <Alert
                        status="error"
                        maxW={400}
                        variant="subtle"
                        flexDirection={'column'}
                    >
                        <AlertIcon boxSize={'40px'} />
                        <AlertTitle mt={4}>ERROR</AlertTitle>
                        <AlertDescription>
                            <code>{error.message}</code>
                        </AlertDescription>
                    </Alert>
                </Center>
            </HStack>
        )
    }

    if (!initiated || !activated) {
        return (
            <HStack h="100vh">
                <Center flexGrow={1} h="100%">
                    <Spinner size={'xl'} />
                </Center>
            </HStack>
        )
    }

    return (
        <HStack h={'100vh'}>
            <Box flexGrow={1} h="100%">
                {children}
            </Box>
        </HStack>
    )
}
