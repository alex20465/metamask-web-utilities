import React, { useEffect, useState } from 'react'
import TrezorConnect from 'trezor-connect'

const HD_HARDENED = 0x80000000
const PATH = [(10016 | HD_HARDENED) >>> 0, 0]

const DEFAULT_NONCE =
    '2d650551248d792eabf628f451200d7f51cb63e46aadcbb1038aacb05e8c8aee2d650551248d792eabf628f451200d7f51cb63e46aadcbb1038aacb05e8c8aee'

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

    const [error, setError] = useState<Error>()

    useEffect(() => {
        TrezorConnect.init({
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
            key: 'Activate Trezor Web Tools ?',
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

    return (
        <context.Provider
            value={{
                initiated,
                activated,
                encryptionKey,
                error,
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
