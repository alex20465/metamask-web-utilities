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
import { ArrowBackIcon } from '@chakra-ui/icons/src/ArrowBack'

import { useMetaMask } from 'metamask-react'

export const DecryptPage: React.FC = () => {
    const [content, setContent] = useState<string>('')
    const [decrypted, setDecrypted] = useState<string | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const { onCopy, hasCopied } = useClipboard(decrypted || '')
    const { account } = useMetaMask()
    const navigate = useNavigate()

    const decrypt = useCallback(async () => {
        if (!account) return
        try {
            const d = await decryptText(account, content)
            if (!d) {
                throw new Error('Decryption was unsuccessful.')
            }
            setDecrypted(d)
        } catch (err) {
            setError(err as Error)
        }
    }, [content, account])

    const changeContent = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) =>
            setContent(event.target.value),
        []
    )

    const goBack = useCallback(() => navigate('/'), [])

    const clear = useCallback(() => {
        setError(null)
        setDecrypted(null)
    }, [])

    return (
        <BaseLayout error={error || undefined} onClearError={clear}>
            <Modal onClose={clear} isOpen={decrypted !== null}>
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
                            onClick={onCopy}
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
                        value={content}
                        rows={10}
                        onChange={changeContent}
                        placeholder="de42f203f993635014edcb91..."
                    />
                    <HStack>
                        <IconButton
                            aria-label="go-back"
                            onClick={goBack}
                            icon={<ArrowBackIcon />}
                        />
                        <Button
                            colorScheme={'green'}
                            width={'100%'}
                            disabled={content.length === 0}
                            onClick={decrypt}
                        >
                            decrypt
                        </Button>
                    </HStack>
                </VStack>
            </Center>
        </BaseLayout>
    )
}
