import React, { useEffect, useState } from 'react'
import { Menu, Table, Button, Radio, Modal, Switch, Popconfirm, notification, message } from 'antd'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import { GlobalStore } from '../../../store/globalStore'
import { createContainer } from 'unstated-next'
import DropRangePicker from '../../../component/from/DropRangePicker'
import PSelect from '../../../component/from/PSelect'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'

import { useOptionFormListHook2, usePage } from '../../../utils/chHooks'
import { useForm } from 'antd/es/form/Form'
import { ICallBackLog, ICallBackUrlSetting, IRequestLog, MCallbackReturnType, MCallbackStyle, MCallMethodType } from '../interface'
import { AjAxPageCommonSetting } from '../../../config/constants'
import { ColumnsType } from 'antd/lib/table/interface'
import LargeTextView from '../../../component/format/LargeTextView/LargeTextView'

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
                data: { appid: currentApp!.id, ...values },
            }).then((res) => {
                if (res.code === 0) {
                    setModalEditCallbackSetting(false)
                }
            })
        })
    }
    return (
        <Modal onCancel={() => setModalEditCallbackSetting(false)} onOk={submit} title="??????????????????" visible={modalEditCallbackSetting}>
            <ChForm
                form={formFef}
                layout={{
                    labelCol: { span: 5 },
                    wrapperCol: { span: 15, offset: 1 },
                }}
                formData={[
                    {
                        type: FormItemType.other,
                        label: '????????????',
                        name: 'return_type',
                        rules: [{ required: true, message: '?????????????????????' }],
                        dom: (
                            <PSelect
                                options={[
                                    {
                                        label: '??????',
                                        value: 1,
                                    },
                                    {
                                        label: '??????',
                                        value: 2,
                                    },
                                ]}
                            />
                        ),
                    },
                    {
                        type: FormItemType.other,
                        label: '??????',
                        name: 'callback_style',
                        dom: (
                            <Radio.Group>
                                <Radio value={1}>www-form-data</Radio>
                                <Radio value={2}>json</Radio>
                                <Radio value={3}>xml</Radio>
                            </Radio.Group>
                        ),
                        rules: [{ required: true, message: '???????????????' }],
                    },
                    {
                        type: FormItemType.other,
                        label: '??????',
                        name: 'is_default',
                        valuePropName: 'checked',
                        dom: <Switch />,
                    },
                    {
                        type: FormItemType.input,
                        label: '??????',
                        name: 'callback_count',
                        rules: [{ required: true, message: '???????????????' }],
                        inputtype: 'number',
                    },
                    {
                        type: FormItemType.input,
                        label: '????????????',
                        rules: [{ required: true, message: '?????????????????????' }],
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
                    <Menu.Item key="callbackSetting">????????????</Menu.Item>
                    <Menu.Item key="requestLog">????????????</Menu.Item>
                    <Menu.Item key="callbackLog">????????????</Menu.Item>
                </Menu>
            </div>
        </div>
    )
}

function CallbackLogTable() {
    const { currentApp } = GlobalStore.useContainer()
    const { options } = useOptionFormListHook2({
        url: '/api/get_open_coins',
        query: { appid: currentApp!.id },
        labelKey: 'symbol',
        onAjaxAfter: (res) => {
            return { status: res.code, list: res.data }
        },
    })
    const { reload, list, total, status } = usePage<ICallBackLog>({
        url: '/api/get_callback_log',
        pageSize: 10,
        query: {},
        onAjaxBefore: AjAxPageCommonSetting.buildOnAjaxBefore({ appid: currentApp!.id }),
        onAjaxAfter: AjAxPageCommonSetting.onAjaxAfter,
        isInitFetch: true,
    })
    const [formRef] = useForm()
    const [spread, setSpread] = useState<boolean>(false)
    const columns: ColumnsType<ICallBackLog> = [
        { title: 'ID', dataIndex: 'id', key: 'id', fixed: 'left', width: 50 },
        {
            title: '??????',
            dataIndex: 'return_time',
            key: 'return_time',
            width: 150,
            fixed: 'left',
            render: (return_time: string) => {
                return return_time && ChUtils.chFormats.formatDate(Number(return_time) * 1000)
            },
        },
        { title: '??????', dataIndex: '1', key: '1' },
        { title: '??????', dataIndex: 'symbol', key: 'symbol' },
        {
            title: '??????',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                return MCallMethodType.get(type)
            },
        },
        {
            title: '??????',
            dataIndex: 'request_param',
            key: 'request_param',
            width: 300,
            render: (request_param) => {
                return <LargeTextView text={request_param} />
            },
        },
        {
            title: '??????',
            dataIndex: 'response_param',
            key: 'response_param',
            width: 300,
            render: (response_param) => {
                return <LargeTextView text={response_param} />
            },
        },
        {
            title: '?????????',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '??????',
            dataIndex: 'err',
            key: 'err',
            render: (err) => {
                return <LargeTextView text={err} />
            },
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
                                    <Button onClick={search}>??????</Button>
                                    <a className="m-l-20 m-r-20">??????????????????</a>
                                    <div
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setSpread(!spread)
                                            console.log('to do ??????')
                                        }}
                                    >
                                        ???????????? {spread ? <CaretUpOutlined /> : <CaretDownOutlined />}
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
                            dom: <PSelect options={options} style={{ width: 130 }} showArrow={false} placeholder="??????????????????"></PSelect>,
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
                                            label: 'GET',
                                            value: 1,
                                        },
                                        {
                                            label: 'POST',
                                            value: 2,
                                        },
                                        {
                                            label: '????????????',
                                            value: 3,
                                        },
                                    ]}
                                    style={{ width: 130 }}
                                    showArrow={false}
                                    placeholder="??????????????????"
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
                            placeholder: '?????????????????????',
                            layout: {
                                span: 5,
                            },
                        },
                    ]}
                />
            </div>
            <div className="requestLogTable-wrap">
                <Table
                    loading={status === 'loading'}
                    rowKey="id"
                    scroll={{ x: 1300 }}
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
            </div>
        </>
    )
}

function RequestLogTable() {
    const { currentApp } = GlobalStore.useContainer()
    const { options } = useOptionFormListHook2({
        url: '/api/get_open_coins',
        query: { appid: currentApp!.id },
        labelKey: 'symbol',
        onAjaxAfter: (res) => {
            return { status: res.code, list: res.data }
        },
    })
    const { reload, list, total, status } = usePage<IRequestLog>({
        url: '/api/get_request_log',
        pageSize: 10,
        query: {},
        onAjaxBefore: AjAxPageCommonSetting.buildOnAjaxBefore({ appid: currentApp!.id }),
        onAjaxAfter: AjAxPageCommonSetting.onAjaxAfter,
        isInitFetch: true,
    })
    const [spread, setSpread] = useState(false)
    const [formRef] = useForm()
    const columns: ColumnsType<IRequestLog> = [
        { title: 'ID', dataIndex: 'id', key: 'id', fixed: 'left', width: 50 },
        {
            title: '????????????',
            dataIndex: 'request_at',
            key: 'request_at',
            width: 150,
            fixed: 'left',
            render: (request_at: string) => {
                return ChUtils.chFormats.formatDate(Number(request_at) * 1000)
            },
        },
        {
            title: '????????????',
            dataIndex: 'type',
            key: 'type',
        },
        { title: '??????', dataIndex: 'symbol', key: 'symbol' },
        { title: 'IP', dataIndex: 'request_ip', key: 'request_ip' },
        {
            title: '??????',
            dataIndex: 'request_param',
            key: 'request_param',
            width: 300,
            render: (request_param: string) => {
                return <LargeTextView text={request_param} />
            },
        },
        {
            title: '????????????',
            dataIndex: 'response_data',
            key: 'response_data',
            width: 300,
            render: (response_data: string) => {
                return <div className="requestLogTable-log">{response_data != 'null' ? <LargeTextView text={response_data} /> : ''}</div>
            },
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
                                    <Button onClick={search}>??????</Button>
                                    <a className="m-l-20 m-r-20">??????????????????</a>
                                    <div
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setSpread(!spread)
                                            console.log('to do ??????')
                                        }}
                                    >
                                        ???????????? {spread ? <CaretUpOutlined /> : <CaretDownOutlined />}
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
                            dom: <PSelect options={options} style={{ width: 130 }} showArrow={false} placeholder="??????????????????"></PSelect>,
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
                                            label: 'GET',
                                            value: 1,
                                        },
                                        {
                                            label: 'POST',
                                            value: 2,
                                        },
                                        {
                                            label: '????????????',
                                            value: 3,
                                        },
                                    ]}
                                    style={{ width: 130 }}
                                    showArrow={false}
                                    placeholder="??????????????????"
                                ></PSelect>
                            ),
                            layout: {
                                span: 5,
                            },
                        },
                        {
                            type: FormItemType.input,
                            name: 'searchValues',
                            label: '',
                            placeholder: '?????????????????????',
                            layout: {
                                span: 5,
                            },
                        },
                    ]}
                />
            </div>
            <div className="requestLogTable-wrap">
                <Table
                    loading={status === 'loading'}
                    rowKey="id"
                    scroll={{ x: 1300 }}
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
            </div>
        </>
    )
}

function CallbackSettingTable() {
    const { setModalEditCallbackSetting, modalEditCallbackSetting } = PageStore.useContainer()
    const { currentApp } = GlobalStore.useContainer()
    const { list, total, reload, status } = usePage<ICallBackUrlSetting>({
        url: '/api/get_callbackurl_page',
        pageSize: 10,
        query: {},
        onAjaxBefore: AjAxPageCommonSetting.buildOnAjaxBefore({ appid: currentApp!.id }),
        onAjaxAfter: AjAxPageCommonSetting.onAjaxAfter,
    })
    useEffect(() => {
        if (!modalEditCallbackSetting) {
            reload()
        }
    }, [modalEditCallbackSetting])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '??????',
            dataIndex: 'return_type',
            key: 'return_type',
            render: (return_type: string) => {
                return <span>{MCallbackReturnType.get(return_type)}</span>
            },
        },
        {
            title: '??????',
            dataIndex: 'is_default',
            key: 'is_default',
            render: (is_default: string, ob: ICallBackUrlSetting) => {
                return (
                    <Switch
                        onClick={(checked) => {
                            ChUtils.Ajax.request({
                                url: '/api/set_callbackurl_state',
                                data: {
                                    id: ob.id,
                                    return_type: ob.return_type,
                                    is_default: checked ? 1 : 0,
                                    appid: currentApp!.id,
                                },
                            }).then((res) => {
                                if (res.code !== 0) return
                                message.success('??????????????????????????????')
                            })
                        }}
                        defaultChecked={is_default == '1'}
                    />
                )
            },
        },
        {
            title: '??????',
            dataIndex: 'callback_style',
            key: 'callback_style',
            render: (callback_style: string) => {
                return <span>{MCallbackStyle.get(callback_style)}</span>
            },
        },
        {
            title: '??????',
            dataIndex: 'callback_count',
            key: 'callback_count',
        },
        {
            title: '??????',
            dataIndex: 'callback_url',
            key: 'callback_url',
            width: 150,
        },
        {
            title: '??????',
            dataIndex: 'option',
            key: 'option',
            render: (_: any, ob: ICallBackUrlSetting) => {
                return (
                    <Popconfirm
                        title="???????????????????"
                        onConfirm={() => {
                            ChUtils.Ajax.request({
                                url: '/api/del_callbackurl_by_id',
                                data: {
                                    id: ob.id,
                                    appid: currentApp!.id,
                                },
                            }).then((res) => {
                                reload()
                            })
                        }}
                    >
                        <Button type="link" danger>
                            ??????
                        </Button>
                    </Popconfirm>
                )
            },
        },
    ]
    return (
        <>
            <ModalEditCallbackSetting />
            <div className="m-b-20" style={{ float: 'right' }}>
                <Button onClick={() => setModalEditCallbackSetting(true)} style={{ width: 80 }} type="primary">
                    ??????
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
        </>
    )
}

function CallbackManagement() {
    const { pageTab } = PageStore.useContainer()
    return (
        <div className="applicationCenter-callbackManagement">
            <Header />
            <div className="table-wrap">
                {pageTab === 'callbackSetting' && <CallbackSettingTable />}
                {pageTab === 'requestLog' && <RequestLogTable />}
                {pageTab === 'callbackLog' && <CallbackLogTable />}
            </div>
        </div>
    )
}
export default () => (
    <PageStore.Provider>
        <CallbackManagement />
    </PageStore.Provider>
)
