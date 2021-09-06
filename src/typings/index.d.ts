export type VerificationCodeType = 'phone' | 'email' | 'google'

export interface IUserInfo {
    current_ip: string
    current_time: number
    email?: string
    email_auth: number
    google_auth: number
    mobile?: string
    mobile_auth: number
    nickname: string
    uid: number
}

export interface IAuthParams {
    email: string
    mobile: string
    google: string
}

// 开通币种
export interface IOpenCoin {
    coin_name: string
    coin_text: string
    icon: string
    id: number
    state: number
    symbol: string
    total: number
}

// export const defaultUserInfo: IUserInfo = {
//     current_ip: '',
//     current_time: new Date().getTime() / 1000,
//     email: undefined,
//     email_auth: 0,
//     google_auth: 0,
//     mobile: undefined,
//     mobile_auth: 0,
//     nickname: '',
//     uid: 0,
// }
