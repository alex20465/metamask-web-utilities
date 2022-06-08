import React, { useEffect, useMemo, useState } from 'react'
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
    Text,
    Link,
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
    }, [status])

    const ConnectComponent = useMemo(
        () => (
            <HStack minH="100vh">
                <Center flexGrow={1} minH="100%">
                    <VStack>
                        <Spinner size={'xl'} />
                        <Text>Connecting ...</Text>
                    </VStack>
                </Center>
            </HStack>
        ),
        []
    )

    const ErrorComponent = useMemo(
        () => (
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
                            <code>{(err as Error)?.message}</code>
                        </AlertDescription>
                        <Button
                            hidden={!onClearError || !pageError}
                            colorScheme={'red'}
                            variant={'link'}
                            aria-label="close-alert"
                            onClick={onClearError}
                        >
                            SKIP
                        </Button>
                    </Alert>
                </Center>
            </HStack>
        ),
        [err]
    )

    if (err) {
        return ErrorComponent
    }

    if (status !== 'connected') {
        return ConnectComponent
    }

    return (
        <VStack minH={'100vh'}>
            <Box p={2}>{account}</Box>
            <Box flexGrow={1} minH="100%" width={'100%'} p={14}>
                {children}
            </Box>
            <Box p={2} color="gray">
                &copy; 2022{' '}
                <Link href="https://alexandros.blue">Alexandros Fotiadis</Link>
                {' - '}
                <Link href="https://github.com/alex20465/metamask-web-utilities">
                    Github
                </Link>
            </Box>
        </VStack>
    )
}
