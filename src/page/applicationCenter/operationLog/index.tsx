import React from 'react'
import { Button, Menu, Table } from 'antd'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import DropRangePicker from '../../../component/from/DropRangePicker'
import { usePage } from '../../../utils/chHooks'
import { IUserLog } from '../interface'
import { AjAxPageCommonSetting } from '../../../config/constants'
import { useForm } from 'antd/lib/form/Form'

function OperationLogTable() {
    const search = () => {
        formRef.validateFields().then((values) => {
            if (values.dateRange && values.dateRange.length > 1) {
                values.start_at = values.dateRange[0].format('YY-MM-DD hh:mm:ss')
                values.end_at = values.dateRange[1].format('YY-MM-DD hh:mm:ss')
                delete values.dateRange
            }
            ChUtils.chFormats.deleteObjectEmptyKey(values)
            reload(undefined, values)
        })
    }
    const [formRef] = useForm()
    const { list, total, reload, status } = usePage<IUserLog>({
        url: '/api/get_user_log',
        pageSize: 10,
        query: {},
        onAjaxBefore: AjAxPageCommonSetting.buildOnAjaxBefore({}),
        onAjaxAfter: AjAxPageCommonSetting.onAjaxAfter,
        isInitFetch: true,
    })
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '操作说明',
            dataIndex: 'name',
            key: 'name',
            width: 150,
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
        },
        {
            title: '浏览器',
            dataIndex: 'browser',
            key: 'browser',
        },
        {
            title: '访问路径',
            dataIndex: 'url',
            key: 'url',
        },
        {
            title: '时间',
            dataIndex: 'otime',
            key: 'otime',
            render: (otime: string) => {
                return ChUtils.chFormats.formatDate(Number(otime) * 1000)
            },
        },
    ]
    return (
        <div className="p-l-40 p-r-40">
            <div style={{ height: 50 }} className="m-t-10">
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
                                <div className="flex-row-center m-l-20">
                                    <Button onClick={search}>筛选</Button>
                                </div>
                            ),
                            layout: {
                                span: 9,
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
    )
}

function Header() {
    return (
        <div className="applicationCenter-common-header">
            <div style={{ width: '100%' }}>
                <Menu defaultSelectedKeys={['1']} mode="horizontal">
                    <Menu.Item key="1">操作日志</Menu.Item>
                </Menu>
            </div>
        </div>
    )
}

function OperationLog() {
    return (
        <div style={{ height: 0 }} className="applicationCenter-operationLog">
            <Header></Header>
            <OperationLogTable />
        </div>
    )
}

export default OperationLog
