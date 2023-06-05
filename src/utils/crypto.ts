import CryptoJS from 'crypto-js'

const CRYPTO_KEY = 'pptist'

/**
 * encryption
 * @param msg To encrypt the string
 */
export const encrypt = (msg: string) => {
  return CryptoJS.AES.encrypt(msg, CRYPTO_KEY).toString()
}

/**
 * decryption
 * @param ciphertext To decrypt the string
 */
export const decrypt = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, CRYPTO_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}