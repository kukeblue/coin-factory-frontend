import React, { useState } from 'react'
import { Button, Menu, Table, Tag, Popconfirm, notification, Modal } from 'antd'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import PSelect from '../../../component/from/PSelect'
import DropRangePicker from '../../../component/from/DropRangePicker'
import { CaretDownOutlined, CaretUpOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { useForm } from 'antd/es/form/Form'
import { useOptionFormListHook2, usePage } from '../../../utils/chHooks'
import { GlobalStore } from '../../../store/globalStore'
import { AjAxPageCommonSetting } from '../../../config/constants'
import { IRechargeBill, IWithdrawRecord, MRechargeBillStatus, MWithdrawRecordStatus } from '../interface'
import { ColumnsType } from 'antd/lib/table/interface'
import Authenticator from '../../../component/auth/Authenticator'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
function RechargeBill() {
    const { currentApp } = GlobalStore.useContainer()
    const [formRef] = useForm()
    const [spread, setSpread] = useState<boolean>(false)
    const { options } = useOptionFormListHook2({
        url: '/api/get_open_coins',
        query: { appid: currentApp!.id },
        labelKey: 'symbol',
        valueKey: 'symbol',
        onAjaxAfter: (res) => {
            return { status: res.code, list: res.data }
        },
    })
    const { reload, list, total, status } = usePage<IRechargeBill>({
        url: '/api/get_zr_list',
        pageSize: 10,
        query: {},
        onAjaxBefore: AjAxPageCommonSetting.buildOnAjaxBefore({ appid: currentApp!.id }),
        onAjaxAfter: AjAxPageCommonSetting.onAjaxAfter,
        isInitFetch: true,
    })
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
    const columns: ColumnsType<IRechargeBill> = [
        { title: 'ID', dataIndex: 'id', key: 'id', fixed: 'left', width: 80, align: 'center' },
        {
            title: '币种',
            dataIndex: 'symbol',
            key: 'symbol',
            width: 80,
            align: 'center',
        },
        { title: '流水号', dataIndex: 'ordid', key: 'ordid' },
        {
            title: '数量',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: '确认数',
            dataIndex: 'confirmations',
            key: 'confirmations',
        },

        { title: '充值地址', dataIndex: 'address', key: 'address', width: 150 },
        { title: '来源地址', dataIndex: 'sourceaddr', key: 'sourceaddr', width: 150 },
        { title: '哈希', dataIndex: 'txid', key: 'txid', width: 200 },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                return <Tag color={status == 2 ? 'error' : status == 1 ? 'success' : 'processing'}>{MRechargeBillStatus.get(status)}</Tag>
            },
        },
        {
            title: '操作',
            align: 'center',
            dataIndex: 'option',
            key: 'option',
            fixed: 'right',
            width: 80,
            render: (_: any, item) => {
                return (
                    (item.status == '1' || item.status == '2') && (
                        <div>
                            <Authenticator
                                callback={() => {
                                    Modal.confirm({
                                        title: '请确认重新回调接口',
                                        content: <></>,
                                        onOk: () => {
                                            // handleAuditWithdraw(item.id, 1)
                                        },
                                        closable: true,
                                        maskClosable: true,
                                    })
                                }}
                            >
                                <span className="text-link">回调</span>
                            </Authenticator>
                        </div>
                    )
                )
            },
        },
    ]

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
                            name: 'searchType',
                            label: '',
                            dom: (
                                <PSelect
                                    options={[
                                        {
                                            label: '地址',
                                            value: 1,
                                        },
                                        {
                                            label: '哈希',
                                            value: 2,
                                        },
                                        {
                                            label: '流水',
                                            value: 3,
                                        },
                                        {
                                            label: '未确认',
                                            value: 4,
                                        },
                                        {
                                            label: '已确认',
                                            value: 5,
                                        },
                                        {
                                            label: '失败',
                                            value: 6,
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
                        {
                            type: FormItemType.input,
                            name: 'searchValues',
                            label: '',
                            placeholder: '请输入查找内容',
                            layout: {
                                span: 5,
                            },
                        },
                    ]}
                />
            </div>
            <Table
                bordered
                scroll={{ x: 1300 }}
                loading={status === 'loading'}
                rowKey="id"
                dataSource={list}
                columns={columns}
                pagination={{
                    total: total,
                    pageSize: 10,
                    defaultCurrent: 1,
                    onChange: (page) => {
                        reload(page)
                    },
                }}
            />
        </>
    )
}

function WithdrawRecord() {
    const { currentApp } = GlobalStore.useContainer()
    const [formRef] = useForm()
    const [spread, setSpread] = useState<boolean>(false)
    const { options } = useOptionFormListHook2({
        url: '/api/get_open_coins',
        query: { appid: currentApp!.id },
        labelKey: 'symbol',
        onAjaxAfter: (res) => {
            return { status: res.code, list: res.data }
        },
    })
    const { reload, list, total, status } = usePage<IWithdrawRecord>({
        url: '/api/get_zc_list',
        pageSize: 10,
        query: {},
        onAjaxBefore: AjAxPageCommonSetting.buildOnAjaxBefore({ appid: currentApp!.id }),
        onAjaxAfter: AjAxPageCommonSetting.onAjaxAfter,
        isInitFetch: true,
    })
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
    const handleAuditWithdraw = (id: string, state: number) => {
        ChUtils.Ajax.request({
            url: '/api/verify',
            data: {
                appid: currentApp?.id,
                id,
                state,
            },
        }).then((res) => {
            if (res.code === 0) {
                notification.success({ message: '审核成功' })
            }
        })
    }
    const columns: ColumnsType<IWithdrawRecord> = [
        { title: 'ID', dataIndex: 'id', key: 'id', fixed: 'left', width: 50 },
        {
            title: '币种',
            dataIndex: 'symbol',
            key: 'symbol',
        },
        { title: '流水号', dataIndex: 'ordid', key: 'ordid' },
        {
            title: '数量',
            dataIndex: 'rpc_number',
            key: 'rpc_number',
        },
        { title: '提出地址', width: 150, dataIndex: 'toAddress', key: 'toAddress' },
        {
            title: '提入地址',
            dataIndex: 'fromAddress',
            key: 'fromAddress',
        },
        {
            title: '哈希',
            dataIndex: 'txid',
            key: 'txid',
        },
        {
            title: '状态',
            dataIndex: 'confirmations',
            key: 'confirmations',
            render: (confirmations) => {
                let color: string = 'default'
                if (confirmations == 0) {
                    color = 'processing'
                } else if (confirmations == 1) {
                    color = 'success'
                } else if (confirmations == 2) {
                    color = 'error'
                } else if (confirmations == 3) {
                    color = 'warning'
                }
                return (
                    <div>
                        <Tag color={color}> {MWithdrawRecordStatus.get(confirmations)}</Tag>
                    </div>
                )
            },
        },
        {
            title: '时间',
            dataIndex: 'create_at',
            key: 'create_at',
            render: (create_at: number) => {
                return ChUtils.chFormats.formatDate(Number(create_at * 1000))
            },
        },
        {
            title: '操作',
            dataIndex: '4',
            key: '4',
            render: (_: any, item) => {
                return (
                    item.confirmations === '3' && (
                        <Authenticator
                            callback={() => {
                                Modal.confirm({
                                    title: '请确认通过审核',
                                    content: <></>,
                                    onOk: () => {
                                        handleAuditWithdraw(item.id, 1)
                                    },
                                    onCancel: (e) => {
                                        if (!e.triggerCancel) {
                                            handleAuditWithdraw(item.id, 2)
                                        }
                                    },
                                    cancelText: '拒绝',
                                    okText: '审核通过',
                                    cancelButtonProps: { danger: true },
                                    closable: true,
                                    maskClosable: true,
                                })
                            }}
                        >
                            {/*<div>*/}
                            {/*    {item.confirmations === '0' && (*/}
                            {/*        <Popconfirm*/}
                            {/*            title="确认通过审核？"*/}
                            {/*            onConfirm={() => {*/}
                            {/*                handleAuditWithdraw(item.id, 1)*/}
                            {/*            }}*/}
                            {/*            onCancel={() => {*/}
                            {/*                handleAuditWithdraw(item.id, 2)*/}
                            {/*            }}*/}
                            {/*            cancelText="拒绝"*/}
                            {/*            okText="审核通过"*/}
                            {/*            cancelButtonProps={{ danger: true, type: 'primary' }}*/}
                            {/*            icon={<QuestionCircleOutlined style={{ color: '#f04f24' }} />}*/}
                            {/*        >*/}
                            {/*            <a className="text-link">审核</a>*/}
                            {/*        </Popconfirm>*/}
                            {/*    )}*/}
                            {/*</div>*/}
                            <a className="text-link">审核</a>
                        </Authenticator>
                    )
                )
            },
        },
    ]
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
                            name: 'searchType',
                            label: '',
                            dom: (
                                <PSelect
                                    options={[
                                        {
                                            label: '地址',
                                            value: 1,
                                        },
                                        {
                                            label: '哈希',
                                            value: 2,
                                        },
                                        {
                                            label: '流水',
                                            value: 3,
                                        },
                                        {
                                            label: '未确认',
                                            value: 4,
                                        },
                                        {
                                            label: '已确认',
                                            value: 5,
                                        },
                                        {
                                            label: '失败',
                                            value: 6,
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
                        {
                            type: FormItemType.input,
                            name: 'searchValues',
                            label: '',
                            placeholder: '请输入查找内容',
                            layout: {
                                span: 5,
                            },
                        },
                    ]}
                />
            </div>
            <Table
                loading={status === 'loading'}
                rowKey="id"
                dataSource={list}
                columns={columns}
                scroll={{ x: 1300 }}
                pagination={{
                    total: total,
                    pageSize: 10,
                    defaultCurrent: 1,
                    onChange: (page) => {
                        reload(page)
                    },
                }}
            />
        </>
    )
}

function Bill() {
    const location = useLocation()
    const prams = qs.parse(location.search)
    const [pageTab, setPageTab] = useState<string>(prams.tab ? prams.tab.toString() : '1')
    return (
        <div className="capital-content">
            <div className="capital-content-header">
                <Menu onClick={(e) => setPageTab(e.key)} selectedKeys={[pageTab]} mode="horizontal">
                    <Menu.Item key="1">充值记录</Menu.Item>
                    <Menu.Item key="2">提币记录</Menu.Item>
                </Menu>
            </div>
            <div className="p-l-40 p-r-40">{pageTab === '1' ? <RechargeBill /> : <WithdrawRecord />}</div>
        </div>
    )
}

export default Bill
