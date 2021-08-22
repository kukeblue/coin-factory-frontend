
export type PayType = 1 | 2 | 3

export const PayTypeMap = {
    1: '预付款',
    2: '到付款',
    3: '回单付'
}

export type WaybillStatus = 1 | 2

export const WaybillStatusMap = {
    1: '已起运',
    2: '已到达',
}

export type PayStatus = 1 | 2

export const PayStatusMap = {
    1: '未支付',
    2: '已支付',
}

export type InvoiceStatus = 1 | 2

export const InvoiceStatusMap = {
    1: '未开票',
    2: '已开票',
}

export type TradingStatus = 1 | 2 | 3 | 4

export const TradingStatusMap = {
    1: '待审核',
    2: '审核成功',
    3: '成功',
    4: '失败',
}

export default {
    PayTypeMap,
    WaybillStatusMap,
    PayStatusMap,
    InvoiceStatusMap,
    TradingStatusMap
}