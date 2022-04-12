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
    Button,
} from '@chakra-ui/react'
import { useTrezor } from '../providers/trezor'

type Props = {
    error?: Error
    onClearError?: () => void
}

export const BaseLayout: React.FC<Props> = ({
    children,
    error: pageError,
    onClearError,
}) => {
    const { error, initiated, activated } = useTrezor()
    const err = error || pageError
    if (err) {
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
                            <code>{err.message}</code>
                        </AlertDescription>

                        {onClearError && pageError ? (
                            <Button
                                colorScheme={'red'}
                                variant={'link'}
                                aria-label="close-alert"
                                onClick={onClearError}
                            >
                                SKIP
                            </Button>
                        ) : null}
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
