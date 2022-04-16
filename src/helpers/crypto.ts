import CryptoJS from 'crypto-js'
import TrezorConnect from 'trezor-connect'

const HD_HARDENED = 0x80000000
const NONCE_PREFIX =
    '6c976aad136ecb3a9555afca84216f79cad017071c16fb9e930dfebeaa0fdd55'
export const PATH = [(10016 | HD_HARDENED) >>> 0, 0]

export const ETH_PATH = "m/44'/60'/0'/0/0"

export const encryptText = async (
    address: string,
    text: string
): Promise<string> => {
    const res = await requestSecret(address)

    if (res.success && res.payload.value.length === 128) {
        return CryptoJS.AES.encrypt(text, res.payload.value).toString()
    } else {
        console.error(res)
        throw new Error('Failed to request decryption')
    }
}

export const decryptText = async (
    address: string,
    text: string
): Promise<string> => {
    const res = await requestSecret(address)

    if (res.success && res.payload.value.length === 128) {
        return CryptoJS.AES.decrypt(text, res.payload.value, {}).toString(
            CryptoJS.enc.Utf8
        )
    } else {
        console.error(res)
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
    text: string
): Promise<{ address: string; signature: string }> => {
    const res = await TrezorConnect.ethereumSignMessage({
        message: text,
        path: "m/44'/60'/0'/0/0",
    })

    if (res.success) {
        return res.payload
    } else {
        console.error(res)
        throw new Error('Failed to request signature')
    }
}

const requestSecret = (address: string) => {
    const nonce = CryptoJS.SHA256(address).toString()
    return TrezorConnect.cipherKeyValue({
        key: 'TWebTools: Secret Key Access ?',
        value: NONCE_PREFIX + nonce,
        askOnDecrypt: true,
        askOnEncrypt: true,
        encrypt: true,
        useEmptyPassphrase: true,
        path: PATH,
    })
}
