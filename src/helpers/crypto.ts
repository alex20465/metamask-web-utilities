import CryptoJS from 'crypto-js'
import TrezorConnect from 'trezor-connect'

const HD_HARDENED = 0x80000000
export const PATH = [(10016 | HD_HARDENED) >>> 0, 0]

export const encryptText = async (
    secret: string,
    text: string
): Promise<string> => {
    const res = await requestSecret('TWebTools: Secret Key Access ?', secret)
    if (res.success && res.payload.value.length === 128) {
        return CryptoJS.AES.encrypt(text, res.payload.value).toString()
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
        return CryptoJS.AES.decrypt(text, res.payload.value, {}).toString(
            CryptoJS.enc.Utf8
        )
    } else {
        throw new Error('Failed to request decryption')
    }
}

export const verifyText = async (
    address: string,
    signature: string,
    text: string
): Promise<boolean> => {
    const res = await TrezorConnect.ethereumVerifyMessage({
        address,
        message: text,
        signature: signature,
    })

    if (res.success && res.payload.message === 'Message verified') {
        return true
    } else {
        return false
    }
}

export const signText = async (
    secret: string,
    text: string
): Promise<{ address: string; signature: string }> => {
    const res = await TrezorConnect.ethereumSignMessage({
        message: text,
        path: "m/44'/60'/0'/0/0",
    })

    if (res.success) {
        return res.payload
    } else {
        throw new Error('Failed to request signature: ' + res.payload.error)
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
