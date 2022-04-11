import { Button, Center } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import { BaseLayout } from '../layouts/BaseLayout'

export const IndexPage: React.FC = () => {
    return (
        <BaseLayout>
            <Center h="100%">
                <Button to="/encrypt" as={Link}>
                    Encrypt
                </Button>
            </Center>
        </BaseLayout>
    )
}
