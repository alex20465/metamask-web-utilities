import type { ExternalProvider } from '@ethersproject/providers'
import { Buffer } from 'buffer'
import { bufferToHex } from 'ethereumjs-util'
import { encrypt, recoverPersonalSignature } from '@metamask/eth-sig-util'

declare global {
    interface Window {
        ethereum: Required<ExternalProvider>
    }
}

const getProvider = () => {
    if (!window.ethereum || !window.ethereum.request)
        throw new Error('Etherium provider not accessible')

    return window.ethereum
}

export const encryptText = async (
    address: string,
    text: string
): Promise<string> => {
    const provider = getProvider()

    const publicKey = await provider.request({
        method: 'eth_getEncryptionPublicKey',
        params: [address],
    })

    if (publicKey) {
        return bufferToHex(
            Buffer.from(
                JSON.stringify(
                    encrypt({
                        publicKey,
                        data: text,
                        version: 'x25519-xsalsa20-poly1305',
                    })
                )
            )
        )
    } else {
        console.error(publicKey)
        throw new Error('Failed to request decryption')
    }
}

export const decryptText = async (
    address: string,
    text: string
): Promise<string> => {
    const provider = getProvider()
    const decryptedMessage = await provider.request({
        method: 'eth_decrypt',
        params: [text, address],
    })
    console.log(decryptedMessage)
    if (decryptedMessage) {
        return decryptedMessage
    } else {
        throw new Error('Failed to request decryption')
    }
}

export const verifyText = async (
    signature: string,
    text: string
): Promise<string> => {
    return recoverPersonalSignature({
        data: text,
        signature: signature,
    })
}

export const signText = async (
    address: string,
    text: string
): Promise<string> => {
    const provider = getProvider()

    const challenge = bufferToHex(Buffer.from(text))
    const signature = provider.request({
        method: 'personal_sign',
        params: [challenge, address],
    })

    if (signature) {
        return signature
    } else {
        throw new Error('Failed to request signature')
    }
}
