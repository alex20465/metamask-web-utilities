import { ArrowBackIcon } from '@chakra-ui/icons/src/ArrowBack'
import {
    Button,
    Center,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    VStack,
} from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { verifyText } from '../helpers/crypto'
import { BaseLayout } from '../layouts/BaseLayout'

import { CheckCircleIcon, NotAllowedIcon } from '@chakra-ui/icons'

import { useMetaMask } from 'metamask-react'
export const VerifyPage: React.FC = () => {
    const [content, setContent] = useState<string>('')
    const [signature, setSignature] = useState<string | null>(null)
    const { account } = useMetaMask()
    const [address, setAddress] = useState<string | null>(account || null)
    const [signer, setSigner] = useState<string | null>(null)
    const [error, setError] = useState<Error | null>(null)

    const navigate = useNavigate()

    const onVerify = useCallback(async () => {
        if (!signature || !address) return

        setSigner(await verifyText(signature, content))
    }, [content, address, signature])

    const onChangeContent = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) =>
            setContent(event.target.value),
        []
    )

    useEffect(() => setAddress(account), [account])

    return (
        <BaseLayout
            error={error || undefined}
            onClearError={() => {
                setError(null)
                setSignature(null)
            }}
        >
            <Modal
                onClose={() => setSignature(null)}
                isOpen={signature !== null && signer !== null}
            >
                <ModalOverlay opacity={0.3} />
                <ModalContent>
                    <ModalHeader>
                        <Heading as="h2" fontSize={'xl'}>
                            SIGNATURE
                        </Heading>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Center h="100%" hidden={address !== signer}>
                            <VStack>
                                <CheckCircleIcon
                                    color="green.200"
                                    boxSize={32}
                                    p={6}
                                />
                                <Heading color="green.200">Verified</Heading>
                                <Heading>Signer</Heading>
                                <Text>{signer}</Text>
                            </VStack>
                        </Center>

                        <Center h="100%" hidden={address === signer}>
                            <VStack>
                                <NotAllowedIcon
                                    color="red.200"
                                    boxSize={32}
                                    p={6}
                                />
                                <Heading color="red.200">Unverified</Heading>
                                <Heading>Signer</Heading>
                                <Text>{signer}</Text>
                            </VStack>
                        </Center>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            width={'100%'}
                            colorScheme={'blue'}
                            onClick={() => setSigner(null)}
                        >
                            OK
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Center h="100%">
                <VStack gap={2} maxW="400px" w="100%">
                    <Heading as={'h1'} fontSize={'2xl'}>
                        VERIFY MESSAGE
                    </Heading>

                    <FormControl>
                        <FormLabel>Address</FormLabel>
                        <Input
                            placeholder="0x42E4739485FEB64E1CFA467C..."
                            value={address || ''}
                            onChange={(ev) => setAddress(ev.target.value)}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Signature</FormLabel>
                        <Input
                            placeholder="f59df66bd01ac0af0f50d000..."
                            value={signature || ''}
                            onChange={(ev) => setSignature(ev.target.value)}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Message</FormLabel>
                        <Textarea
                            value={content}
                            rows={5}
                            onChange={onChangeContent}
                            placeholder="signed message ..."
                        />
                    </FormControl>
                    <HStack>
                        <IconButton
                            aria-label="go-back"
                            onClick={() => navigate('/')}
                            icon={<ArrowBackIcon />}
                        />
                        <Button
                            colorScheme={'green'}
                            width={'100%'}
                            disabled={
                                content.length === 0 ||
                                signature?.length !== 132 ||
                                address?.length !== 42
                            }
                            onClick={onVerify}
                        >
                            verify
                        </Button>
                    </HStack>
                </VStack>
            </Center>
        </BaseLayout>
    )
}
