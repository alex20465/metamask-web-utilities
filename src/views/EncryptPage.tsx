import {
    Alert,
    AlertIcon,
    Button,
    Center,
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
import { encryptText } from '../helpers/crypto'
import { BaseLayout } from '../layouts/BaseLayout'
import { useTrezor } from '../providers/trezor'

export const EncryptPage: React.FC = () => {
    const [content, setContent] = useState<string>('')
    const [encrypted, setEncrypted] = useState<string | null>(null)
    const { onCopy, hasCopied } = useClipboard(encrypted || '')

    const { encryptionKey, initiated, activated } = useTrezor()

    const onEncrypt = useCallback(async () => {
        if (!encryptionKey) {
            throw new Error('No encryption key')
        }
        const encryptedContent = await encryptText(encryptionKey, content)
        setEncrypted(encryptedContent)
    }, [initiated, activated, content])

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
                    <ModalHeader>Encrypted Message</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Textarea readOnly rows={20}>
                            {encrypted}
                        </Textarea>
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
                            {hasCopied ? 'Copied !' : 'Copy to Clipboard'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Center h="100%">
                <VStack gap={2} maxW="400px" w="100%">
                    <Alert hidden={!!encryptionKey} status="warning">
                        <AlertIcon />
                        No Encryption Key
                    </Alert>
                    <Textarea
                        disabled={!!!encryptionKey}
                        value={content}
                        onChange={onChangeContent}
                        placeholder="Content to encrypt"
                    />
                    <Button
                        colorScheme={'green'}
                        width={'100%'}
                        disabled={content.length === 0}
                        onClick={onEncrypt}
                    >
                        Encrypt
                    </Button>
                </VStack>
            </Center>
        </BaseLayout>
    )
}
