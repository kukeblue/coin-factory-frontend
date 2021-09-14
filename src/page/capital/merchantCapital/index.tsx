import { Button, Menu, Table, Modal, message } from 'antd'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import React, { useEffect, useState } from 'react'
import { IAccountLog, IMerchantCapital } from '../interface'
import { ColumnsType } from 'antd/lib/table/interface'
import CoinTemplate from '../../../component/template/CoinTemplate'
import './index.less'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import QRCode from 'qrcode.react'
import { createContainer } from 'unstated-next'
import { GlobalStore } from '../../../store/globalStore'
import { useOptionFormListHook2, usePage } from '../../../utils/chHooks'
import { ICallBackLog } from '../../applicationCenter/interface'
import { AjAxPageCommonSetting } from '../../../config/constants'
import { useForm } from 'antd/es/form/Form'
import LargeTextView from '../../../component/Format/LargeTextView/LargeTextView'
import DropRangePicker from '../../../component/from/DropRangePicker'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import PSelect from '../../../component/from/PSelect'

function usePageStore() {
    const [modalRechargeShow, setModalRechargeShow] = useState(false)

    return {
        modalRechargeShow,
        setModalRechargeShow,
    }
}

const PageStore = createContainer(usePageStore)

function ModalRecharge() {
    const { modalRechargeShow, setModalRechargeShow } = PageStore.useContainer()
    return (
        <Modal onOk={() => setModalRechargeShow(false)} onCancel={() => setModalRechargeShow(false)} title="充币" visible={modalRechargeShow}>
            <div className="ModalRecharge">
                <div className="ModalRecharge-qrcode">
                    <QRCode
                        id="ModalRecharge"
                        value={'https://ch-ui.kukechen.top/'}
                        size={200} // 二维码的大小
                        fgColor="#000000" // 二维码的颜色
                        style={{ margin: 'auto' }}
                    />
                </div>
                <div className="m-t-30 m-b-30 flex-center">
                    <div>cbadf3d59e287036d5b71eba9af153f4</div>
                    <CopyToClipboard
                        text="123"
                        onCopy={() => {
                            message.success('复制成功')
                        }}
                    >
                        <div className="button-copy"></div>
                    </CopyToClipboard>
                </div>
                <div>
                    <div className="flex-line m-b-10">
                        <div className="button-tip"></div>
                        <span className="modalRecharge-tip">目前不支持区块奖励（CoinBase）和智能合约的转账充值，请您谅解</span>
                    </div>
                    <div className="flex-line m-b-10">
                        <div className="button-tip"></div>
                        <span className="modalRecharge-tip">使用ETH-Ethereum地址充值需要12个网络确认才能到账，30个网络确认后才能提现</span>
                    </div>
                    <div className="flex-line">
                        <div className="button-tip"></div>
                        <span className="modalRecharge-tip">ETH-Ethereum单笔充值大于0。001ETH-Ethereum才可以到账</span>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

function MerchantCapital() {
    const { modalRechargeShow, setModalRechargeShow } = PageStore.useContainer()
    const [list, setList] = useState<IMerchantCapital[]>([])
    useEffect(() => {
        if (modalRechargeShow) return
        ChUtils.Ajax.request({
            url: '/api/get_user_account',
        }).then((res) => {
            if (res.code === 0) {
                setList(res.data)
            }
        })
    }, [modalRechargeShow])

    const columns: ColumnsType<IMerchantCapital> = [
        {
            title: '币种',
            dataIndex: 'coin_name',
            key: 'coin_name',
            render: (_: any, item: IMerchantCapital) => {
                return <CoinTemplate dec={item.coin_text} name={item.coin_name} icon={item.icon} />
            },
        },
        { title: '可用', dataIndex: 'balance', key: 'balance' },
        { title: '冻结', dataIndex: 'frost', key: 'frost' },
        { title: '总额', dataIndex: 'total', key: 'total' },
        {
            title: '操作',
            dataIndex: '5',
            key: '5',
            render: () => {
                return <a onClick={() => setModalRechargeShow(true)}>充值</a>
            },
        },
    ]

    return (
        <div>
            <ModalRecharge />
            <Table rowKey="id" dataSource={list} columns={columns} />
        </div>
    )
}

function ExpenseRecord() {
    const { currentApp } = GlobalStore.useContainer()
    const { options } = useOptionFormListHook2({
        url: '/api/get_open_coins',
        query: { appid: currentApp!.id },
        labelKey: 'symbol',
        onAjaxAfter: (res) => {
            return { status: res.code, list: res.data }
        },
    })
    const { reload, list, total, status } = usePage<IAccountLog>({
        url: '/api/get_user_account_log',
        pageSize: 10,
        query: {},
        onAjaxBefore: AjAxPageCommonSetting.buildOnAjaxBefore({ appid: currentApp!.id }),
        onAjaxAfter: AjAxPageCommonSetting.onAjaxAfter,
        isInitFetch: true,
    })
    const [formRef] = useForm()
    const [spread, setSpread] = useState<boolean>(false)
    const columns: ColumnsType<IAccountLog> = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        {
            title: '收支类型',
            dataIndex: 'name',
            key: 'name',
        },
        { title: '金额', dataIndex: 'income', key: 'income' },
        {
            title: '总额',
            dataIndex: 'money',
            key: 'money',
        },
        { title: '明细', dataIndex: 'remark', key: 'remark' },
        {
            title: '时间',
            dataIndex: 'addtime',
            key: 'addtime',
        },
    ]
    const search = () => {
        formRef.validateFields().then((res) => {
            if (res.dateRange && res.dateRange.length > 1) {
                res.start_at = res.dateRange[0].format('YY-MM-DD hh:mm:ss')
                res.end_at = res.dateRange[1].format('YY-MM-DD hh:mm:ss')
            }
            delete res.dateRange
            ChUtils.chFormats.deleteObjectEmptyKey(res)
            reload(undefined, res)
        })
    }
    return (
        <>
            <div className={spread ? 'search-bar_spread' : 'search-bar'}>
                <ChForm
                    form={formRef}
                    formData={[
                        {
                            type: FormItemType.other,
                            name: 'dateRange',
                            label: '',
                            dom: <DropRangePicker />,
                            layout: {
                                span: 15,
                            },
                        },
                        {
                            type: FormItemType.other,
                            name: 'submitButton',
                            label: '',
                            dom: (
                                <div className="flex-center">
                                    <Button onClick={search}>筛选</Button>
                                    <a className="m-l-20 m-r-20">导出当前结果</a>
                                    <div
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setSpread(!spread)
                                            console.log('to do 下拉')
                                        }}
                                    >
                                        更多条件 {spread ? <CaretUpOutlined /> : <CaretDownOutlined />}
                                    </div>
                                </div>
                            ),
                            layout: {
                                span: 9,
                            },
                        },
                        {
                            type: FormItemType.other,
                            name: 'symbol',
                            label: '',
                            dom: <PSelect options={options} style={{ width: 130 }} showArrow={false} placeholder="选择币种类型"></PSelect>,
                            layout: {
                                span: 5,
                            },
                        },
                        {
                            type: FormItemType.other,
                            name: 'node',
                            label: '',
                            dom: (
                                <PSelect
                                    options={[
                                        {
                                            label: '资金类型',
                                            value: 1,
                                        },
                                    ]}
                                    style={{ width: 130 }}
                                    showArrow={false}
                                    placeholder="选择查找类型"
                                />
                            ),
                            layout: {
                                span: 5,
                            },
                        },
                    ]}
                />
            </div>
            <div className="requestLogTable-wrap">
                <Table
                    loading={false}
                    rowKey="id"
                    dataSource={list}
                    columns={columns}
                    pagination={{
                        total: 0,
                        pageSize: 10,
                        defaultCurrent: 1,
                        onChange: (page) => {
                            reload(page)
                        },
                    }}
                />
            </div>
        </>
    )
}

function Page() {
    const [tab, setTab] = useState('1')
    const handleMenuClick = (e: any) => {
        setTab(e.key)
    }
    return (
        <div className="capital-content">
            <div className="capital-content-header">
                <Menu onClick={(e) => handleMenuClick(e)} defaultSelectedKeys={[tab]} mode="horizontal">
                    <Menu.Item key="1">充值记录</Menu.Item>
                    <Menu.Item key="2">资金记录</Menu.Item>
                </Menu>
            </div>
            <div className="p-l-40 p-r-40 p-t-10">{tab === '1' ? <MerchantCapital /> : <ExpenseRecord></ExpenseRecord>}</div>
        </div>
    )
}

export default () => (
    <PageStore.Provider>
        <Page />
    </PageStore.Provider>
)
