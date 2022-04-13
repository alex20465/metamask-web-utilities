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
import { decryptText } from '../helpers/crypto'
import { BaseLayout } from '../layouts/BaseLayout'
import { useTrezor } from '../providers/trezor'
import { ArrowBackIcon } from '@chakra-ui/icons/src/ArrowBack'

export const DecryptPage: React.FC = () => {
    const [content, setContent] = useState<string>('')
    const [decrypted, setDecrypted] = useState<string | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const { onCopy, hasCopied } = useClipboard(decrypted || '')

    const navigate = useNavigate()
    const { encryptionKey } = useTrezor()

    const onDecrypt = useCallback(async () => {
        if (!encryptionKey) return
        const d = await decryptText(encryptionKey, content)

        if (!d) {
            return setError(new Error('Decryption was unsuccessful.'))
        }
        setDecrypted(d)
    }, [content, encryptionKey])

    const onChangeContent = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) =>
            setContent(event.target.value),
        []
    )
    return (
        <BaseLayout
            error={error || undefined}
            onClearError={() => {
                setError(null)
                setDecrypted(null)
            }}
        >
            <Modal
                onClose={() => setDecrypted(null)}
                isOpen={decrypted !== null}
            >
                <ModalOverlay opacity={0.3} />
                <ModalContent>
                    <ModalHeader>
                        <Heading as="h2" fontSize={'xl'}>
                            DECRYPTED MESSAGE
                        </Heading>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Textarea value={decrypted || ''} rows={10} />
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
                        DECRYPT MESSAGE
                    </Heading>
                    <Textarea
                        disabled={!!!encryptionKey}
                        value={content}
                        rows={10}
                        onChange={onChangeContent}
                        placeholder="U2FsdGVkX18GA7U9KuP+tUXeSmpuNV5G6/SV..."
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
                            onClick={onDecrypt}
                        >
                            decrypt
                        </Button>
                    </HStack>
                </VStack>
            </Center>
        </BaseLayout>
    )
}
