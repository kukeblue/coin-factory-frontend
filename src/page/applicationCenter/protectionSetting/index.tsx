import React from 'react'
import { Button, Dropdown, Menu, Table } from 'antd'

function SettingTable() {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '订单号',
            dataIndex: '1',
            key: '1',
        },
        {
            title: '数量',
            dataIndex: '3',
            key: '3',
        },
        {
            title: '币种',
            dataIndex: '4',
            key: '4',
        },
        {
            title: '提币地址',
            dataIndex: '5',
            key: '5',
        },
        {
            title: '时间',
            dataIndex: '6',
            key: '6',
        },
        {
            title: '状态',
            dataIndex: '7',
            key: '7',
        },
        {
            title: '操作',
            dataIndex: '0',
            key: '0',
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
                    <Menu.Item key="1">防护设置</Menu.Item>
                </Menu>
            </div>
            <Button type="primary" className="header-button">
                添加
            </Button>
        </div>
    )
}

function ProtectionSetting() {
    return (
        <div className="applicationCenter-protectionSetting">
            <Header></Header>
            <SettingTable />
        </div>
    )
}

export default ProtectionSetting
