import React from 'react'
import './App.css'

import { HashRouter, Route, Routes } from 'react-router-dom'
import { IndexPage } from '../views/IndexPage'
import { extendTheme, ChakraProvider, ThemeConfig } from '@chakra-ui/react'
import { EncryptPage } from '../views/EncryptPage'
import { DecryptPage } from '../views/DecryptPage'
import { SignPage } from '../views/SignPage'
import { VerifyPage } from '../views/VerifyPage'
import { MetaMaskProvider } from 'metamask-react'
const colors = {}

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
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
            <MetaMaskProvider>
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<IndexPage />} />
                        <Route path="/encrypt" element={<EncryptPage />} />
                        <Route path="/decrypt" element={<DecryptPage />} />
                        <Route path="/sign" element={<SignPage />} />
                        <Route path="/verify" element={<VerifyPage />} />
                    </Routes>
                </HashRouter>
            </MetaMaskProvider>
        </ChakraProvider>
    )
}

export default App
