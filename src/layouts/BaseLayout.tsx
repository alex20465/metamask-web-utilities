import React, { useEffect, useState } from 'react'
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
    VStack,
} from '@chakra-ui/react'

import { useMetaMask } from 'metamask-react'

type Props = {
    error?: Error
    onClearError?: () => void
}

export const BaseLayout: React.FC<Props> = ({
    children,
    error: pageError,
    onClearError,
}) => {
    const [error, setError] = useState<Error | null>(null)

    const { connect, status, account } = useMetaMask()

    const err = error || pageError

    useEffect(() => {
        if (status !== 'connected') connect().catch((err) => setError(err))
    }, [])
    if (err) {
        return (
            <HStack minH="100vh">
                <Center flexGrow={1} minH="100%">
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

    if (status !== 'connected') {
        return (
            <HStack minH="100vh">
                <Center flexGrow={1} minH="100%">
                    <Spinner size={'xl'} />
                </Center>
            </HStack>
        )
    }

    return (
        <VStack minH={'100vh'}>
            <Box flexGrow={1} minH="100%" width={'100%'} p={14}>
                {children}
            </Box>
            <Box p={2}>{account}</Box>
        </VStack>
    )
}
