import { AES, enc } from 'crypto-js'
import TrezorConnect from 'trezor-connect'

const HD_HARDENED = 0x80000000
export const PATH = [(10016 | HD_HARDENED) >>> 0, 0]

export const encryptText = async (
    secret: string,
    text: string
): Promise<string> => {
    const res = await requestSecret('TWebTools: Secret Key Access ?', secret)

    if (res.success && res.payload.value.length === 128) {
        return AES.encrypt(text, res.payload.value).toString()
    } else {
        throw new Error('Failed to request decryption')
    }
}

export const decryptText = async (
    secret: string,
    text: string
): Promise<string> => {
    const res = await requestSecret('TWebTools: Secret Key Access ?', secret)

    if (res.success && res.payload.value.length === 128) {
        return AES.decrypt(text, res.payload.value, {}).toString(enc.Utf8)
    } else {
        throw new Error('Failed to request decryption')
    }
}

const requestSecret = (message: string, value: string) =>
    TrezorConnect.cipherKeyValue({
        key: message,
        value,
        askOnDecrypt: true,
        askOnEncrypt: true,
        encrypt: true,
        useEmptyPassphrase: true,
        path: PATH,
    })
