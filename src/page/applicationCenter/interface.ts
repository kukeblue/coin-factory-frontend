export interface IReplay {
    avatar: string
    contents: string
    nickname: string
    replay_time: string
}

export interface IProtectSetting {
    add_at: string
    app_id: string
    app_name: string
    id: string
    ips: string
    lower_limit: string
    remind_type: string
    symbol: string
    up_at: string
    upper_limit: string
}

export interface IWordOrder {
    contents: string
    create_at: string
    id: string
    ordid: string
    state: string
    status: string
    title: string
    update_at: string
    user_id: string
}

export interface IWorkOrderDetail {
    Id: number
    Ordid: string
    Title: string
    Contents: string
    UserId: string
    CreateAt: number
    UpdateAt: number
    Status: number
    State: number
}

export interface IUserLog {
    browser: string
    data: string
    id: string
    ip: string
    method: string
    name: string
    otime: string
    uid: string
    url: string
}

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

export interface IRequestLog {
    app_id: string
    app_name: string
    create_at: string
    id: string
    method: string
    request_at: string
    request_ip: string
    request_param: string
    response_at: string
    response_data: string
    symbol: string
    type: string
}

export interface ICallBackLog {
    app_id: string
    app_name: string
    code: string
    err: string
    id: string
    nid: string
    request_param: string
    response_param: string
    return_time: string
    return_url: string
    sign: string
    symbol: string
    type: string
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

export const MCallMethodType = new Map([
    ['1', 'GET'],
    ['2', 'POST'],
    ['3', '请求地址'],
])

export const MWorkOrderStatusMap = new Map([
    ['0', '处理中'],
    ['1', '已处理'],
    ['2', '已解决'],
])
