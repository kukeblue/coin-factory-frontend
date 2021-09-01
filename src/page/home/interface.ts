// 市场行情
export interface IMarket {
    Id: string
    Name: string // 币种名称
    Symbol: string // 币种简称
    LogoPng: string //币种图片
    Rank: string
    PriceUsd: string //对美元汇率
    PriceBtc: string //对比特币汇率
    Volume24hUsd: string // 24小时成交量
    MarketCapUsd: string //流通市值
    AvailableSupply: string // 当前供应量
    TotalSupply: string // 流通数量
    MaxSupply: string // 最大供应量
    PercentChange1h: string
    PercentChange24h: string // 24涨幅
    PercentChange7d: string
    LastUpdated: string
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
