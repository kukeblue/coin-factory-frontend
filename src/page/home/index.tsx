import { Col, Progress, Row, Button, Card, Table, Spin } from 'antd'
import { ChTablePanel, ChUtils } from 'ch-ui'
import React, { useEffect, useState } from 'react'
import './index.less'
import { IMarket } from './interface'
import { GlobalStore } from '../../store/globalStore'
import { IOpenCoin } from '../../typings'
import CoinTemplate from '../../component/template/CoinTemplate'
import { useHistory } from 'react-router-dom'

function OpenedCoins() {
    const [openCoins, setOpenCoins] = useState<IOpenCoin[]>()
    const { currentApp } = GlobalStore.useContainer()
    const history = useHistory()
    useEffect(() => {
        if (!currentApp) return
        ChUtils.Ajax.request({
            url: '/api/get_index_coins',
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
            <Spin spinning={openCoins === undefined}>
                <Row style={{ minHeight: 100 }}>
                    {openCoins?.map((item, index) => {
                        return (
                            <Col key={'_' + index} className="flex-center" span={8}>
                                <Card hoverable className="home-openedCoins-item">
                                    <div className="flex-row-center">
                                        <div className="coin-pic m-r-10">
                                            <img src={item.icon} />
                                        </div>
                                        <div>
                                            <div className="coin-name-en">{item.coin_name}</div>
                                            <div className="coin-name">{item.symbol}</div>
                                        </div>
                                    </div>
                                    <div className="coin-progress-wrap flex">
                                        <div className="coin-progress-label">地址数</div>
                                        <div className="coin-progress">
                                            <div style={{ textAlign: 'center' }}>
                                                {/*{item.sacle}*/}
                                                0%
                                            </div>
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
                                    <div className="coin-item-option">
                                        <a
                                            onClick={() => {
                                                history.push('/capital/recharge')
                                            }}
                                        >
                                            充值
                                        </a>
                                        <a
                                            onClick={() => {
                                                history.push('/capital/recharge?tab=2')
                                            }}
                                            className="m-l-20"
                                        >
                                            提币
                                        </a>
                                    </div>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </Spin>
        </div>
    )
}

function QuotationTable() {
    const [list, setList] = useState<IMarket[]>([])
    const columns = [
        {
            title: '#',
            dataIndex: 'rank',
            key: 'rank',
            sorter: {
                compare: (a: IMarket, b: IMarket) => Number(a.rank) - Number(b.rank),
                multiple: 1,
            },
        },
        {
            title: '名称',
            dataIndex: 'Name',
            // sorter: {
            //     compare: (a: IMarket, b: IMarket) => a.Name.localeCompare(b.Name),
            //     multiple: 1,
            // },
            key: 'Name',
            render: (Name: string, item: IMarket) => {
                return <CoinTemplate name={item.name} icon={item.logo_png} dec={item.symbol} />
            },
        },
        {
            title: '最新价',
            dataIndex: 'price_usd',
            key: 'price_usd',
            render: (_: any, item: IMarket) => {
                return (
                    <div>
                        <div>
                            {item.price_usd}
                            <span className="m-l-5">$</span>
                        </div>
                        <div>
                            ≈{item.cny}
                            <span className="m-l-5">¥</span>
                        </div>
                    </div>
                )
            },
        },
        {
            title: '24小时涨幅（¥）',
            dataIndex: 'percent_change_h24',
            key: 'percent_change_h24',
            render: (percent_change_h24: string) => {
                return <div className={Number(percent_change_h24) < 0 ? 'green' : 'red'}>{Number(percent_change_h24)}%</div>
            },
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
