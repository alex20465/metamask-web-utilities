import React, { useEffect, useState } from 'react'
import TrezorConnect, { DEVICE, DEVICE_EVENT } from 'trezor-connect'

const HD_HARDENED = 0x80000000
const PATH = [(10016 | HD_HARDENED) >>> 0, 0]

const DEFAULT_NONCE =
    '6c976aad136ecb3a9555afca84216f79cad017071c16fb9e930dfebeaa0fdd5506eede3366abd31b8dd3b80c3701096638be157eb065b1ba1cfa89d711fc3fa2'

type TrezorContext = {
    initiated: boolean
    activated: boolean
    encryptionKey?: string
    error?: Error
    trezor: typeof TrezorConnect
}

const context = React.createContext<TrezorContext>({
    initiated: false,
    activated: false,
    trezor: TrezorConnect,
})

export const TrezorProvider: React.FC = ({ children }) => {
    const [initiated, setInitiated] = useState<boolean>(false)
    const [activated, setActivated] = useState<boolean>(false)
    const [encryptionKey, setEncryptionKey] = useState<string>()

    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        TrezorConnect.init({
            popup: true,
            manifest: {
                appUrl: 'http://localhost:3000/',
                email: 'fotiadis@alexandros.blue',
            },
        })
            .then(() => setInitiated(true))
            .catch((err: Error) => {
                if (err.message.includes('has been already initialized')) {
                    setInitiated(true)
                } else {
                    setError(err)
                }
            })
    }, [])

    useEffect(() => {
        if (!initiated) return

        TrezorConnect.cipherKeyValue({
            key: 'TWebTools: Activate ?',
            value: DEFAULT_NONCE,
            askOnDecrypt: true,
            askOnEncrypt: true,
            encrypt: true,
            useEmptyPassphrase: true,
            path: PATH,
        })
            .then((res) => {
                if (res.success) {
                    setEncryptionKey(res.payload.value)
                    setActivated(true)
                } else {
                    setError(new Error('Activation failed.'))
                }
            })
            .catch((err) => setError(err))
    }, [initiated])

    useEffect(() => {
        if (activated && initiated) {
            TrezorConnect.on(DEVICE_EVENT, (event) => {
                if (event.type === DEVICE.DISCONNECT) {
                    setActivated(false)
                    setInitiated(false)
                    setError(new Error('Device Disconnected'))
                } else if (event.type === DEVICE.CONNECT) {
                    setInitiated(true)
                    setError(null)
                }
            })
        }

        return () => TrezorConnect.removeAllListeners()
    }, [activated, initiated])

    return (
        <context.Provider
            value={{
                initiated,
                activated,
                encryptionKey,
                error: error || undefined,
                trezor: TrezorConnect,
            }}
        >
            {children}
        </context.Provider>
    )
}

export const useTrezor = () => {
    const { initiated, trezor, error, activated, encryptionKey } =
        React.useContext(context)

    return { initiated, trezor, error, activated, encryptionKey }
}
