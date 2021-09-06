import { Col, Progress, Row, Button, Card, Table } from 'antd'
import { ChTablePanel, ChUtils } from 'ch-ui'
import React, { useEffect, useState } from 'react'
import './index.less'
import { IMarket } from './interface'
import { GlobalStore } from '../../store/globalStore'
import { IOpenCoin } from '../../typings'

function OpenedCoins() {
    const [openCoins, setOpenCoins] = useState<IOpenCoin[]>()
    const { currentApp } = GlobalStore.useContainer()
    useEffect(() => {
        if (!currentApp) return
        ChUtils.Ajax.request({
            url: '/api/get_open_coins',
            data: {
                appid: currentApp?.id,
            },
            method: 'post',
        }).then((res) => {
            if (res.data) {
                setOpenCoins(res.data)
            }
        })
    }, [currentApp])

    return (
        <div className="home-openedCoins">
            <div className="title1 m-b-10 m-l-5">开通币种</div>
            <Row>
                <Col className="flex-center" span={8}>
                    <Card hoverable className="home-openedCoins-item">
                        <div className="flex-row-center">
                            <div className="coin-pic m-r-10"></div>
                            <div>
                                <div className="coin-name-en">BTC</div>
                                <div className="coin-name">比特币</div>
                            </div>
                        </div>
                        <div className="coin-progress-wrap flex">
                            <div className="coin-progress-label">地址数</div>
                            <div className="coin-progress">
                                <div style={{ textAlign: 'center' }}>70%</div>
                                <div>
                                    <Progress
                                        success={{
                                            percent: 70,
                                            strokeColor: '#15C8C0',
                                        }}
                                        percent={70}
                                        strokeWidth={15}
                                        className="coin-progress-body"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex-between coin-item-option">
                            <a>充值</a>
                            <a>提币</a>
                            <a>归集</a>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

function QuotationTable() {
    const [list, setList] = useState<IMarket[]>([])
    const columns = [
        {
            title: '#',
            dataIndex: 'Rank',
            key: 'Rank',
            sorter: {
                compare: (a: IMarket, b: IMarket) => Number(a.Rank) - Number(b.Rank),
                multiple: 1,
            },
        },
        {
            title: '简称',
            dataIndex: 'Name',
            sorter: {
                compare: (a: IMarket, b: IMarket) => a.Name.localeCompare(b.Name),
                multiple: 1,
            },
            key: 'Name',
            render: (Name: string, item: IMarket) => {
                return (
                    <div className="flex-row-center">
                        <img src={'https://i.loli.net/2021/08/29/rgtP8s5VFKhnaYM.png'} className="coin-pic m-r-10"></img>
                        <div>
                            <div className="coin-name-en">{item.Symbol}</div>
                            <div className="coin-name">{Name}</div>
                        </div>
                    </div>
                )
            },
        },
        {
            title: '流通市值（¥）',
            dataIndex: 'MarketCapUsd',
            key: 'MarketCapUsd',
        },
        {
            title: '全球指数（¥）',
            dataIndex: '4',
            key: '4',
        },
        {
            title: '24(H)（¥）',
            dataIndex: 'PercentChange1h',
            key: 'PercentChange1h',
        },
        {
            title: '流通数量',
            dataIndex: 'TotalSupply',
            key: 'TotalSupply',
        },
        {
            title: '24H换手',
            dataIndex: 'Volume24hUsd',
            key: 'Volume24hUsd',
        },
        {
            title: '24H涨幅',
            dataIndex: 'PercentChange24h',
            key: 'PercentChange24h',
        },
        {
            title: '7天指数趋势',
            dataIndex: 'PercentChange7d',
            key: 'PercentChange7d',
        },
    ]
    useEffect(() => {
        ChUtils.Ajax.request({
            url: '/api/get_market',
            method: 'post',
            data: {},
        }).then((res) => {
            if (res.data) {
                setList(res.data)
            }
        })
    }, [])
    return (
        <div className="title1 m-t-70">
            <div className="m-b-20">行情数据</div>
            <div>
                <Table rowKey="Id" dataSource={list} columns={columns} pagination={false}></Table>
            </div>
        </div>
    )
}

function Home() {
    return (
        <div className="home">
            <OpenedCoins />
            <QuotationTable />
            <div className="title1 m-t-70">
                <div>区块浏览器</div>
                <br />
                <div>
                    <div className="home-ad-block"></div>
                </div>
            </div>
        </div>
    )
}

export default Home
