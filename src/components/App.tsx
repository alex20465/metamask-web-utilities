import React from 'react'
import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { IndexPage } from '../views/IndexPage'
import { TrezorProvider } from '../providers/trezor'
import { ChakraProvider } from '@chakra-ui/react'
import { EncryptPage } from '../views/EncryptPage'

function App() {
    return (
        <ChakraProvider>
            <TrezorProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<IndexPage />} />
                        <Route path="/encrypt" element={<EncryptPage />} />
                    </Routes>
                </BrowserRouter>
            </TrezorProvider>
        </ChakraProvider>
    )
}

export default App
