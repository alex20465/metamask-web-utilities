import { Center, Heading, IconButton, Stack, VStack } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import { BaseLayout } from '../layouts/BaseLayout'
import {
    DecryptIcon,
    EncryptIcon,
    FoxIcon,
    SignIcon,
    VerifyIcon,
} from '../icons/Encryption'
export const IndexPage: React.FC = () => {
    return (
        <BaseLayout>
            <Center minH="100%">
                <VStack>
                    <Heading as="h1" color="#00ebff" size={'2xl'} mb={'32px'}>
                        METAMASK Web Utilities
                    </Heading>

                    <FoxIcon boxSize={'254px'} p={'32px'} />

                    <Stack
                        direction={{
                            base: 'column',
                            md: 'row',
                        }}
                        gap={8}
                    >
                        <VStack gap={2}>
                            <IconButton
                                variant="outline"
                                aria-label="encrypt"
                                colorScheme={'orange'}
                                icon={<EncryptIcon boxSize={'80px'} />}
                                to="/encrypt"
                                boxSize={'150px'}
                                as={Link}
                            />
                            <Heading as="h2" fontSize={'lg'}>
                                Encrypt
                            </Heading>
                        </VStack>
                        <VStack gap={2}>
                            <IconButton
                                variant="outline"
                                aria-label="decrypt"
                                colorScheme={'red'}
                                icon={<DecryptIcon boxSize={'80px'} />}
                                to="/decrypt"
                                boxSize={'150px'}
                                as={Link}
                            />
                            <Heading as="h2" fontSize={'lg'}>
                                Decrypt
                            </Heading>
                        </VStack>
                        <VStack gap={2}>
                            <IconButton
                                variant="outline"
                                aria-label="sign"
                                colorScheme={'blue'}
                                to="/sign"
                                as={Link}
                                icon={<SignIcon boxSize={'80px'} />}
                                boxSize={'150px'}
                            />
                            <Heading as="h2" fontSize={'lg'}>
                                Sign
                            </Heading>
                        </VStack>
                        <VStack gap={2}>
                            <IconButton
                                variant="outline"
                                aria-label="verify"
                                colorScheme={'orange'}
                                to="/verify"
                                as={Link}
                                icon={<VerifyIcon boxSize={'80px'} />}
                                boxSize={'150px'}
                            />
                            <Heading as="h2" fontSize={'lg'}>
                                Verify
                            </Heading>
                        </VStack>
                    </Stack>
                </VStack>
            </Center>
        </BaseLayout>
    )
}
