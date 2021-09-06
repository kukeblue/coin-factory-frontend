import React, { useState } from 'react'
import { Menu, Table, Button, DatePicker } from 'antd'
import { ChForm, FormItemType } from 'ch-ui'
import { GlobalStore } from '../../../store/globalStore'
import { createContainer } from 'unstated-next'
import DropRangePicker from '../../../component/from/DropRangePicker'
import PSelect from '../../../component/from/PSelect'
import { CaretDownOutlined } from '@ant-design/icons'
import { useOptionFormListHook2, usePage } from '../../../utils/chHooks'

type ManagePageTab = 'callbackSetting' | 'requestLog' | 'callbackLog'

function usePageStore() {
    const [pageTab, setPageTab] = useState<ManagePageTab>('requestLog')

    return { pageTab, setPageTab }
}

const PageStore = createContainer(usePageStore)

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
    const columns = [
        { title: 'ID', dataIndex: '1', key: '1' },
        { title: '应用', dataIndex: '2', key: '2' },
        { title: '请求方法', dataIndex: '3', key: '3' },
        { title: '币种', dataIndex: '4', key: '4' },
        { title: '参数', dataIndex: '5', key: '5' },
        { title: 'IP', dataIndex: '6', key: '6' },
        { title: '返回数据', dataIndex: '6', key: '6' },
        { title: '时间', dataIndex: '6', key: '6' },
    ]
    return (
        <div className="p-l-40 p-r-40 p-t-10">
            <div className="flex-row-center search-bar">
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
                                    <Button>筛选</Button>
                                    <a className="m-l-20 m-r-20">导出当前结果</a>
                                    <div>
                                        更多条件 <CaretDownOutlined />
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
                            dom: <PSelect style={{ width: 130 }} showArrow={false} placeholder="选择查找类型"></PSelect>,
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
                ></ChForm>
            </div>
            <Table dataSource={[]} columns={columns} />
        </div>
    )
}

function CallbackSettingTable() {
    const { currentApp } = GlobalStore.useContainer()
    const { list } = usePage({
        url: '/api/get_callbackurl_page',
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
    })
    const columns = [
        {
            title: '应用',
            dataIndex: '1',
            key: '1',
        },
        {
            title: '类型',
            dataIndex: '2',
            key: '2',
        },
        {
            title: '状态',
            dataIndex: '3',
            key: '3',
        },
        {
            title: '方式',
            dataIndex: '4',
            key: '4',
        },
        {
            title: '次数',
            dataIndex: '5',
            key: '5',
        },
        {
            title: '地址',
            dataIndex: '6',
            key: '6',
        },
    ]
    return (
        <div className="p-l-40 p-r-40 p-t-10">
            <Table dataSource={[]} columns={columns} />
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
        </div>
    )
}
export default () => (
    <PageStore.Provider>
        <CallbackManagement />
    </PageStore.Provider>
)
