export interface IRechargeRecord {}

export interface IMerchantCapital {
    balance: string
    coin_name: string
    coin_text: string
    frost: string
    icon: string
    id: string
    symbol: string
    total: string
}

export interface IRechargeBill {
    address: string
    amount: string
    confirmations: string
    create_time: string
    id: string
    ordid: string
    rpc_number: string
    sourceaddr: string
    status: string
    symbol: string
    txid: string
}

export interface IWithdrawRecord {
    amount: string
    confirmations: string
    create_at: string
    fromAddress: string
    id: string
    ordid: string
    rpc_number: string
    symbol: string
    toAddress: string
    status: string
    txid: string
}

export interface IAccountLog {
    account: string
    addtime: string
    expend: string
    id: string
    income: string
    money: string
    name: string
    remark: string
    symbol: string
}

export interface IAddress {
    addr: string
    created_at: string
    id: string
    main_symbol: string
    symbol: string
}

export const MWithdrawRecordStatus = new Map([
    ['0', '待确认'],
    ['1', '已确认'],
    ['2', '失败'],
    ['3', '待审核'],
])
