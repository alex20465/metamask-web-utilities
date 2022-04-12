import { Center, HStack, IconButton, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import { BaseLayout } from '../layouts/BaseLayout'
import {
    CheckCircleIcon,
    EditIcon,
    LockIcon,
    UnlockIcon,
} from '@chakra-ui/icons'
export const IndexPage: React.FC = () => {
    return (
        <BaseLayout>
            <Center h="100%">
                <HStack gap={8}>
                    <VStack gap={2}>
                        <IconButton
                            variant="ghost"
                            aria-label="encrypt"
                            colorScheme={'green'}
                            icon={<LockIcon boxSize={50} />}
                            to="/encrypt"
                            boxSize={150}
                            as={Link}
                        />
                        <Text>Encrypt</Text>
                    </VStack>
                    <VStack gap={2}>
                        <IconButton
                            variant="ghost"
                            aria-label="decrypt"
                            colorScheme={'red'}
                            icon={<UnlockIcon boxSize={50} />}
                            to="/decrypt"
                            boxSize={150}
                            as={Link}
                        />
                        <Text>Decrypt</Text>
                    </VStack>
                    <VStack gap={2}>
                        <IconButton
                            variant="ghost"
                            aria-label="sign"
                            colorScheme={'blue'}
                            icon={<EditIcon boxSize={50} />}
                            to="/decrypt"
                            boxSize={150}
                            as={Link}
                        />
                        <Text>Sign</Text>
                    </VStack>
                    <VStack gap={2}>
                        <IconButton
                            variant="ghost"
                            aria-label="verify"
                            colorScheme={'orange'}
                            icon={<CheckCircleIcon boxSize={50} />}
                            to="/decrypt"
                            boxSize={150}
                            as={Link}
                        />
                        <Text>Verify</Text>
                    </VStack>
                </HStack>
            </Center>
        </BaseLayout>
    )
}
