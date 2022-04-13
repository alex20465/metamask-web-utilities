import React from 'react'
import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { IndexPage } from '../views/IndexPage'
import { TrezorProvider } from '../providers/trezor'
import { extendTheme, ChakraProvider, ThemeConfig } from '@chakra-ui/react'
import { EncryptPage } from '../views/EncryptPage'
import { DecryptPage } from '../views/DecryptPage'

const colors = {}

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: true,
} as ThemeConfig

const theme = extendTheme({
    colors,
    config,
    fontSizes: {
        xs: '18px',
        sm: '22px',
        md: '24px',
    },
    fonts: {
        heading: `'Codystar', cursive`,
        body: `'VT323', monospace`,
    },
})

function App() {
    return (
        <ChakraProvider theme={theme}>
            <TrezorProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<IndexPage />} />
                        <Route path="/encrypt" element={<EncryptPage />} />
                        <Route path="/decrypt" element={<DecryptPage />} />
                    </Routes>
                </BrowserRouter>
            </TrezorProvider>
        </ChakraProvider>
    )
}

export default App
