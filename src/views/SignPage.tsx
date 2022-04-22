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
    Textarea,
    useClipboard,
    VStack,
} from '@chakra-ui/react'
import { useMetaMask } from 'metamask-react'
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signText } from '../helpers/crypto'
import { BaseLayout } from '../layouts/BaseLayout'

export const SignPage: React.FC = () => {
    const [content, setContent] = useState<string>('')
    const [signature, setSignature] = useState<string | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const { onCopy, hasCopied } = useClipboard(signature || '')
    const { account } = useMetaMask()
    const navigate = useNavigate()

    const sign = useCallback(async () => {
        if (!account) return
        try {
            setSignature(await signText(account, content))
        } catch (err) {
            setError(err as Error)
        }
    }, [content, account])

    const changeContent = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) =>
            setContent(event.target.value),
        []
    )
    const clear = useCallback(() => {
        setError(null)
        setSignature(null)
    }, [])

    const goBack = useCallback(() => navigate('/'), [])

    return (
        <BaseLayout error={error || undefined} onClearError={clear}>
            <Modal onClose={clear} isOpen={signature !== null}>
                <ModalOverlay opacity={0.3} />
                <ModalContent>
                    <ModalHeader>
                        <Heading as="h2" fontSize={'xl'}>
                            SIGNATURE
                        </Heading>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Address</FormLabel>
                            <Input value={account || ''} />
                        </FormControl>
                        <FormControl label="Signature">
                            <FormLabel>Signature</FormLabel>
                            <Input value={signature || ''} />
                        </FormControl>
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
                        SIGN MESSAGE
                    </Heading>
                    <Textarea
                        value={content}
                        rows={10}
                        onChange={changeContent}
                        placeholder="sign message ..."
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
                            onClick={sign}
                        >
                            sign
                        </Button>
                    </HStack>
                </VStack>
            </Center>
        </BaseLayout>
    )
}
