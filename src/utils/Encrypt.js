/**
 * Created by leeqj on 07/11/2016.
 */
import CryptoJS from 'crypto-js'

export default class Encrypt {
    static encrypt(string, secretKey) {
        string = CryptoJS.AES.encrypt(
            CryptoJS.enc.Utf8.parse(string),
            CryptoJS.enc.Utf8.parse(secretKey),
            { mode: CryptoJS.mode.ECB, iv: CryptoJS.enc.Utf8.parse(secretKey), padding: CryptoJS.pad.Pkcs7 }
        ).toString()
        return string
    }

    static BASE64(string) {
        let wordArray = CryptoJS.enc.Utf8.parse(string)
        let base64string = CryptoJS.enc.Base64.stringify(wordArray)
        // console.log('encrypted:', base64string)
        return base64string
    }

    static decodeBASE64(base64string) {
        let parsedWordArray = CryptoJS.enc.Base64.parse(base64string)
        var string = parsedWordArray.toString(CryptoJS.enc.Utf8)
        return string
    }

    // static encryptURLSafeString(string, secretKey){
    //     string = CryptoJS.AES.encrypt(
    //         CryptoJS.enc.Base64.parse(string),
    //         CryptoJS.enc.Base64.parse(secretKey),
    //         { mode: CryptoJS.mode.ECB, iv: CryptoJS.enc.Base64.parse(secretKey), padding: CryptoJS.pad.Pkcs7 }
    //     ).toString()
    //     return string
    // }
    //
    // static decryptURLSafeString(string, secretKey){
    //     string = CryptoJS.AES.decrypt(
    //         string,
    //         CryptoJS.enc.Base64.parse(secretKey),
    //         { mode: CryptoJS.mode.ECB, iv: CryptoJS.enc.Base64.parse(secretKey), padding: CryptoJS.pad.Pkcs7}
    //     )
    //     return CryptoJS.enc.Base64.stringify(string)
    // }

    static decrypt(string, secretKey) {
        string = CryptoJS.AES.decrypt(
            string,
            CryptoJS.enc.Utf8.parse(secretKey),
            { mode: CryptoJS.mode.ECB, iv: CryptoJS.enc.Utf8.parse(secretKey), padding: CryptoJS.pad.Pkcs7 }
        )
        string = CryptoJS.enc.Utf8.stringify(string)
        return string
    }

    static md5(value) {
        return CryptoJS.MD5(value).toString()
    }
}
