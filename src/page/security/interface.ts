export interface IUserInfo {
    current_ip: string
    current_time: number
    email?: string
    email_auth: number
    google_auth: number
    mobile?: number
    mobile_auth: number
    nickname: string
    uid: number
}

export const defaultUserInfo: IUserInfo = {
    current_ip: '',
    current_time: new Date().getTime() / 1000,
    email: undefined,
    email_auth: 0,
    google_auth: 0,
    mobile: undefined,
    mobile_auth: 0,
    nickname: '',
    uid: 0,
}

export interface LoginLog {
    email: string
    id: string
    last_login_address: string
    last_login_ip: string
    last_login_time: '1619837096'
    login_address: '本机地址 本机地址  '
    login_ip: '127.0.0.1'
    login_time: '1619948154'
    mobile: '13763975576'
}
