import { AES } from 'crypto-js'

export const encryptText = async (
    secret: string,
    text: string
): Promise<string> => {
    return AES.encrypt(text, secret).toString()
}
