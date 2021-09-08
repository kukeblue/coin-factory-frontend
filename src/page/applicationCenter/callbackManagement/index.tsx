import React, { useEffect, useState } from 'react'
import { Menu, Table, Button, Radio, Modal, Switch, Popconfirm } from 'antd'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import { GlobalStore } from '../../../store/globalStore'
import { createContainer } from 'unstated-next'
import DropRangePicker from '../../../component/from/DropRangePicker'
import PSelect from '../../../component/from/PSelect'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'

import { useOptionFormListHook2, usePage } from '../../../utils/chHooks'
import { useForm } from 'antd/es/form/Form'
import { ICallBackUrlSetting, MCallbackReturnType, MCallbackStyle } from '../interface'
import { AjAxPageCommonSetting } from '../../../config/constants'

type ManagePageTab = 'callbackSetting' | 'requestLog' | 'callbackLog'

function usePageStore() {
    const [pageTab, setPageTab] = useState<ManagePageTab>('callbackSetting')
    const [modalEditCallbackSetting, setModalEditCallbackSetting] = useState(false)
    return { pageTab, setPageTab, modalEditCallbackSetting, setModalEditCallbackSetting }
}

const PageStore = createContainer(usePageStore)

function ModalEditCallbackSetting() {
    const { currentApp } = GlobalStore.useContainer()
    const { modalEditCallbackSetting, setModalEditCallbackSetting } = PageStore.useContainer()
    const [formFef] = useForm()
    const submit = () => {
        formFef.validateFields().then((values) => {
            if (values.is_default) {
                values.is_default = 1
            } else {
                values.is_default = 0
            }
            console.log(values)
            ChUtils.Ajax.request({
                url: '/api/insert_callback_url',
                data: { appid: currentApp.id, ...values },
            }).then((res) => {
                if (res.code === 0) {
                    setModalEditCallbackSetting(false)
                }
            })
        })
    }
    return (
        <Modal onCancel={() => setModalEditCallbackSetting(false)} onOk={submit} title="新增回调地址" visible={modalEditCallbackSetting}>
            <ChForm
                form={formFef}
                layout={{
                    labelCol: { span: 5 },
                    wrapperCol: { span: 15, offset: 1 },
                }}
                formData={[
                    {
                        type: FormItemType.other,
                        label: '回调类型',
                        name: 'return_type',
                        rules: [{ required: true, message: '请选择回调类型' }],
                        dom: (
                            <PSelect
                                options={[
                                    {
                                        label: '转入',
                                        value: 1,
                                    },
                                    {
                                        label: '转出',
                                        value: 2,
                                    },
                                ]}
                            />
                        ),
                    },
                    {
                        type: FormItemType.other,
                        label: '方式',
                        name: 'callback_style',
                        dom: (
                            <Radio.Group>
                                <Radio value={1}>www-form-data</Radio>
                                <Radio value={2}>json</Radio>
                                <Radio value={3}>xml</Radio>
                            </Radio.Group>
                        ),
                        rules: [{ required: true, message: '请选择方式' }],
                    },
                    {
                        type: FormItemType.other,
                        label: '状态',
                        name: 'is_default',
                        valuePropName: 'checked',
                        dom: <Switch />,
                    },
                    {
                        type: FormItemType.input,
                        label: '次数',
                        name: 'callback_count',
                        rules: [{ required: true, message: '请输入次数' }],
                        inputtype: 'number',
                    },
                    {
                        type: FormItemType.input,
                        label: '回调地址',
                        rules: [{ required: true, message: '请输入回调地址' }],
                        name: 'callback_url',
                    },
                ]}
            />
        </Modal>
    )
}

function Header() {
    const { setPageTab, pageTab } = PageStore.useContainer()
    const handleMenuClick = (e: any) => {
        setPageTab(e.key)
    }
    return (
        <div className="applicationCenter-common-header">
            <div style={{ width: '100%' }}>
                <Menu onClick={(e) => handleMenuClick(e)} defaultSelectedKeys={[pageTab]} mode="horizontal">
                    <Menu.Item key="callbackSetting">回调设置</Menu.Item>
                    <Menu.Item key="requestLog">请求日志</Menu.Item>
                    <Menu.Item key="callbackLog">回调日志</Menu.Item>
                </Menu>
            </div>
        </div>
    )
}

function CallbackLogTable() {
    const { currentApp } = GlobalStore.useContainer()
    const { options } = useOptionFormListHook2({
        url: '/api/get_open_coins',
        query: { appid: currentApp.id },
        labelKey: 'symbol',
        onAjaxAfter: (res) => {
            return { status: res.code, list: res.data }
        },
    })
    const { reload } = usePage({
        url: '/api/get_callback_log',
        pageSize: 10,
        query: {},
        onAjaxBefore: (req) => {
            return {
                url: req.url,
                data: {
                    page: req.data.pageNo,
                    limit: req.data.pageSize,
                    appid: currentApp.id,
                },
            }
        },
        isInitFetch: false,
    })
    const [spread, setSpread] = useState<boolean>(false)
    const columns = [
        { title: 'ID', dataIndex: 'app_id', key: 'app_id' },
        { title: '应用', dataIndex: 'app_name', key: 'app_name' },
        { title: '请求方法', dataIndex: 'type', key: 'type' },
        { title: '币种', dataIndex: 'symbol', key: 'symbol' },
        { title: '参数', dataIndex: 'request_param', key: 'request_param' },
        { title: 'IP', dataIndex: 'request_ip', key: 'request_ip' },
        { title: '返回数据', dataIndex: 'response_data', key: 'response_data' },
        { title: '时间', dataIndex: 'request_at', key: 'request_at' },
    ]
    const [list, setList] = useState([])
    const search = () => {
        ChUtils.Ajax.request({
            url: '/api/get_callback_log',
            data: {
                page: 1,
                limit: 10,
                appid: currentApp.id,
            },
        }).then((res) => {
            if (res.code === 0) {
                setList(res.data.list)
            }
        })
        console.log('search')
    }
    return (
        <div className="p-l-40 p-r-40 p-t-10">
            <div className={spread ? 'search-bar search-bar_spread' : 'search-bar'}>
                <ChForm
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
                            name: '1',
                            label: '',
                            dom: <PSelect options={options} style={{ width: 130 }} showArrow={false} placeholder="选择币种类型"></PSelect>,
                            layout: {
                                span: 5,
                            },
                        },
                        {
                            type: FormItemType.other,
                            name: '2',
                            label: '',
                            dom: (
                                <PSelect
                                    options={[
                                        {
                                            label: '转入',
                                            value: 1,
                                        },
                                        {
                                            label: '转出',
                                            value: 2,
                                        },
                                        {
                                            label: '流水',
                                            value: 3,
                                        },
                                        {
                                            label: '回调地址',
                                            value: 4,
                                        },
                                    ]}
                                    style={{ width: 130 }}
                                    showArrow={false}
                                    placeholder="选择查找类型"
                                ></PSelect>
                            ),
                            layout: {
                                span: 5,
                            },
                        },
                        {
                            type: FormItemType.input,
                            name: '3',
                            label: '',
                            placeholder: '请输入查找内容',
                            layout: {
                                span: 5,
                            },
                        },
                    ]}
                />
            </div>
            <Table dataSource={list} columns={columns} />
        </div>
    )
}

function RequestLogTable() {
    const { currentApp } = GlobalStore.useContainer()
    const { options } = useOptionFormListHook2({
        url: '/api/get_open_coins',
        query: { appid: currentApp.id },
        labelKey: 'symbol',
        onAjaxAfter: (res) => {
            return { status: res.code, list: res.data }
        },
    })
    const { reload } = usePage({
        url: '/api/get_request_log',
        pageSize: 10,
        query: {},
        onAjaxBefore: (req) => {
            return {
                url: req.url,
                data: {
                    page: req.data.pageNo,
                    limit: req.data.pageSize,
                    appid: currentApp.id,
                },
            }
        },
        isInitFetch: false,
    })
    const [spread, setSpread] = useState(false)
    const columns = [
        { title: 'ID', dataIndex: 'app_id', key: 'app_id' },
        { title: '应用', dataIndex: 'app_name', key: 'app_name' },
        { title: '请求方法', dataIndex: 'type', key: 'type' },
        { title: '币种', dataIndex: 'symbol', key: 'symbol' },
        { title: '参数', dataIndex: 'request_param', key: 'request_param' },
        { title: 'IP', dataIndex: 'request_ip', key: 'request_ip' },
        { title: '返回数据', dataIndex: 'response_data', key: 'response_data' },
        { title: '时间', dataIndex: 'request_at', key: 'request_at' },
    ]
    const [list, setList] = useState([])
    const search = () => {
        ChUtils.Ajax.request({
            url: '/api/get_callback_log',
            data: {
                page: 1,
                limit: 10,
                appid: currentApp.id,
            },
        }).then((res) => {
            if (res.code === 0) {
                setList(res.data.list)
            }
        })
        console.log('search')
    }
    return (
        <div className="p-l-40 p-r-40 p-t-10">
            <div className={spread ? 'search-bar search-bar_spread' : 'search-bar'}>
                <ChForm
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
                            name: '1',
                            label: '',
                            dom: <PSelect options={options} style={{ width: 130 }} showArrow={false} placeholder="选择币种类型"></PSelect>,
                            layout: {
                                span: 5,
                            },
                        },
                        {
                            type: FormItemType.other,
                            name: '2',
                            label: '',
                            dom: (
                                <PSelect
                                    options={[
                                        {
                                            label: 'GET',
                                            value: 1,
                                        },
                                        {
                                            label: 'POST',
                                            value: 2,
                                        },
                                        {
                                            label: '请求地址',
                                            value: 3,
                                        },
                                    ]}
                                    style={{ width: 130 }}
                                    showArrow={false}
                                    placeholder="选择查找类型"
                                ></PSelect>
                            ),
                            layout: {
                                span: 5,
                            },
                        },
                        {
                            type: FormItemType.input,
                            name: '3',
                            label: '',
                            placeholder: '请输入查找内容',
                            layout: {
                                span: 5,
                            },
                        },
                    ]}
                />
            </div>
            <Table dataSource={list} columns={columns} />
        </div>
    )
}

function CallbackSettingTable() {
    const { setModalEditCallbackSetting, modalEditCallbackSetting } = PageStore.useContainer()
    const { currentApp } = GlobalStore.useContainer()
    const { list, total, reload, status } = usePage<ICallBackUrlSetting>({
        url: '/api/get_callbackurl_page',
        pageSize: 10,
        query: {},
        onAjaxBefore: AjAxPageCommonSetting.buildOnAjaxBefore({ appid: currentApp.id }),
        onAjaxAfter: AjAxPageCommonSetting.onAjaxAfter,
    })
    useEffect(() => {
        if (!modalEditCallbackSetting) {
            reload()
        }
    }, [modalEditCallbackSetting])
    const columns = [
        {
            title: '应用',
            dataIndex: 'app_name',
            key: 'app_name',
        },
        {
            title: '类型',
            dataIndex: 'return_type',
            key: 'return_type',
            render: (return_type: string) => {
                return <span>{MCallbackReturnType.get(return_type)}</span>
            },
        },
        {
            title: '状态',
            dataIndex: 'is_default',
            key: 'is_default',
            render: (is_default: string) => {
                return <Switch checked={is_default == '1'} />
            },
        },
        {
            title: '方式',
            dataIndex: 'callback_style',
            key: 'callback_style',
            render: (callback_style: string) => {
                return <span>{MCallbackStyle.get(callback_style)}</span>
            },
        },
        {
            title: '次数',
            dataIndex: 'callback_count',
            key: 'callback_count',
        },
        {
            title: '地址',
            dataIndex: 'callback_url',
            key: 'callback_url',
            width: 150,
        },
        {
            title: '操作',
            dataIndex: 'option',
            key: 'option',
            render: (_: any, ob: ICallBackUrlSetting) => {
                return (
                    <Popconfirm
                        title="是否确认删除?"
                        onConfirm={() => {
                            ChUtils.Ajax.request({
                                url: '/api/del_callbackurl_by_id',
                                data: {
                                    id: ob.id,
                                    appid: currentApp.id,
                                },
                            }).then((res) => {
                                reload()
                            })
                        }}
                    >
                        <Button type="link" danger>
                            删除
                        </Button>
                    </Popconfirm>
                )
            },
        },
    ]
    return (
        <div className="p-l-40 p-r-40 p-t-10">
            <ModalEditCallbackSetting />
            <div className="m-b-20" style={{ float: 'right' }}>
                <Button onClick={() => setModalEditCallbackSetting(true)} style={{ width: 80 }} type="primary">
                    添加
                </Button>
            </div>
            <Table
                loading={status === 'loading'}
                rowKey="id"
                dataSource={list}
                columns={columns}
                pagination={{
                    total,
                    pageSize: 10,
                    onChange: (pageNo) => {
                        reload(pageNo)
                    },
                }}
            />
        </div>
    )
}

function CallbackManagement() {
    const { pageTab } = PageStore.useContainer()
    return (
        <div className="applicationCenter-callbackManagement">
            <Header />
            {pageTab === 'callbackSetting' && <CallbackSettingTable />}
            {pageTab === 'requestLog' && <RequestLogTable />}
            {pageTab === 'callbackLog' && <CallbackLogTable />}
        </div>
    )
}
export default () => (
    <PageStore.Provider>
        <CallbackManagement />
    </PageStore.Provider>
)
