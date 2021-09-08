export interface IAppInfo {
    allows_ip: string
    app_name: string
    appkey: string
    end_time: number
    id: number
    logo: string
    start_time: number
    state: number | boolean
}

export interface ICanOpenCoin {
    coin_name: string
    coin_text: string
    icon: string
    id: 1
    symbol: string
}

export interface ICallBackUrlSetting {
    app_id: string
    app_name: string
    callback_count: string
    callback_style: string
    callback_url: string
    create_at: string
    id: string
    is_default: string
    return_type: string
    update_at: string
}

export const MCallbackReturnType = new Map([
    ['1', '转入'],
    ['2', '转出'],
])

export const MCallbackStyle = new Map([
    ['1', 'www-form-data'],
    ['2', 'json'],
    ['3', 'xml'],
])
