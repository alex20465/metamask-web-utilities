import React, { useEffect, useState } from 'react'
import TrezorConnect, { DEVICE, DEVICE_EVENT } from 'trezor-connect'
import { ETH_PATH } from '../helpers/crypto'

type TrezorContext = {
    initiated: boolean
    activated: boolean
    address?: string
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
    const [address, setAddress] = useState<string>()

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

        TrezorConnect.ethereumGetAddress({
            path: ETH_PATH,
        })
            .then((res) => {
                if (res.success) {
                    setAddress(res.payload.address)
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
                address,
                error: error || undefined,
                trezor: TrezorConnect,
            }}
        >
            {children}
        </context.Provider>
    )
}

export const useTrezor = () => {
    const { initiated, trezor, error, activated, address } =
        React.useContext(context)

    return { initiated, trezor, error, activated, address }
}
