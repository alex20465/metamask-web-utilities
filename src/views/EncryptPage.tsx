import {
    Button,
    Center,
    Heading,
    HStack,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea,
    useClipboard,
    VStack,
} from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { encryptText } from '../helpers/crypto'
import { BaseLayout } from '../layouts/BaseLayout'
import { useTrezor } from '../providers/trezor'
import { ArrowBackIcon } from '@chakra-ui/icons/src/ArrowBack'

export const EncryptPage: React.FC = () => {
    const [content, setContent] = useState<string>('')
    const [encrypted, setEncrypted] = useState<string | null>(null)
    const { onCopy, hasCopied } = useClipboard(encrypted || '')
    const navigate = useNavigate()
    const { encryptionKey } = useTrezor()

    const onEncrypt = useCallback(async () => {
        if (!encryptionKey) {
            throw new Error('No encryption key')
        }
        const encryptedContent = await encryptText(encryptionKey, content)
        setEncrypted(encryptedContent)
        setContent('') // unset secret message
    }, [content, encryptionKey])

    const onChangeContent = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) =>
            setContent(event.target.value),
        []
    )

    return (
        <BaseLayout>
            <Modal
                onClose={() => setEncrypted(null)}
                isOpen={encrypted !== null}
            >
                <ModalOverlay opacity={0.3} />
                <ModalContent>
                    <ModalHeader>
                        <Heading as="h2" fontSize={'xl'}>
                            ENCRYPTED MESSAGE
                        </Heading>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Textarea value={encrypted || ''} rows={10} />
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            width={'100%'}
                            colorScheme={'green'}
                            disabled={hasCopied}
                            onClick={() => {
                                onCopy()
                            }}
                        >
                            {hasCopied ? 'copied !' : 'copy to clipboard'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Center h="100%">
                <VStack gap={2} maxW="400px" w="100%">
                    <Heading as={'h1'} fontSize={'2xl'}>
                        ENCRYPT MESSAGE
                    </Heading>
                    <Textarea
                        value={content}
                        rows={10}
                        onChange={onChangeContent}
                        placeholder="my secret message ..."
                    />
                    <HStack>
                        <IconButton
                            aria-label="go-back"
                            onClick={() => navigate('/')}
                            icon={<ArrowBackIcon />}
                        />
                        <Button
                            colorScheme={'green'}
                            width={'100%'}
                            disabled={content.length === 0}
                            onClick={onEncrypt}
                        >
                            encrypt
                        </Button>
                    </HStack>
                </VStack>
            </Center>
        </BaseLayout>
    )
}
