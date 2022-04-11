import { Box, Button, Center, Textarea } from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import { BaseLayout } from '../layouts/BaseLayout'

export const EncryptPage: React.FC = () => {
    const [content, setContent] = useState<string>('')

    const onEncrypt = useCallback(async () => {
        console.log('works')
    }, [])

    const onChangeContent = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) =>
            setContent(event.target.value),
        []
    )

    return (
        <BaseLayout>
            <Center h="100%">
                <Box maxW={'600px'}>
                    <Textarea
                        value={content}
                        onChange={onChangeContent}
                        placeholder="Content to encrypt"
                    />

                    <Button onClick={onEncrypt}>Encrypt</Button>
                </Box>
            </Center>
        </BaseLayout>
    )
}
