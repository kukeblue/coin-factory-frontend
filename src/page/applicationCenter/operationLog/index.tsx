import React from 'react'
import { Button, Menu, Table } from 'antd'

function OperationLogTable() {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '操作说明',
            dataIndex: '1',
            key: '1',
        },
        {
            title: '应用',
            dataIndex: '3',
            key: '3',
        },
        {
            title: 'IP',
            dataIndex: '4',
            key: '4',
        },
        {
            title: '浏览器',
            dataIndex: '5',
            key: '5',
        },
        {
            title: '访问路径',
            dataIndex: '6',
            key: '6',
        },
        {
            title: '时间',
            dataIndex: '7',
            key: '7',
        },
    ]
    return (
        <div className="p-l-40 p-r-40">
            <Table rowKey="id" dataSource={[]} columns={columns}></Table>
        </div>
    )
}

function Header() {
    return (
        <div className="applicationCenter-common-header">
            <div style={{ width: '100%' }}>
                <Menu defaultSelectedKeys={['0']} mode="horizontal">
                    <Menu.Item key="1">操作日志</Menu.Item>
                </Menu>
            </div>
        </div>
    )
}

function OperationLog() {
    return (
        <div className="applicationCenter-operationLog">
            <Header></Header>
            <OperationLogTable />
        </div>
    )
}

export default OperationLog
