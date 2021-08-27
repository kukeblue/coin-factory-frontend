import { Button, Layout } from 'antd'
import React from 'react'
import './index.less'
import { Menu } from 'antd'

const { Header } = Layout

function AdminLayout({ children }: { children: JSX.Element }) {
    return (
        <div className="admin-layout">
            <Header style={{ background: '#23282B' }} className="flex-center">
                <div className="layout-header flex-row-between">
                    <div className="flex-center">
                        <div className="layout-logo"></div>
                        <div className="layout-splitline"></div>
                        <Menu selectedKeys={['1']} theme="dark" className="layout-menu" mode="horizontal">
                            <Menu.Item key="1">首页</Menu.Item>
                            <Menu.Item key="2">应用中心</Menu.Item>
                            <Menu.Item key="3">安全</Menu.Item>
                            <Menu.Item key="4">资金</Menu.Item>
                            <Menu.Item key="5">开发文档</Menu.Item>
                            <Menu.Item key="6">上币申请</Menu.Item>
                            <Menu.Item key="7">商户中心</Menu.Item>
                        </Menu>
                    </div>
                    <div className="flex-center layout-header-right">
                        <div className="flex-center layout-header-option m-r-20">
                            <span className="iconfont icon-xiaoxi"></span>
                            消息
                        </div>
                        <div className="layout-header-option m-b-3">退出</div>
                    </div>
                </div>
            </Header>
            <div className="layout-content">{children}</div>
        </div>
    )
}

function MyLayout({ children }: { children: JSX.Element }) {
    return (
        <div className="layout">
            <AdminLayout>{children}</AdminLayout>
        </div>
    )
}

export default MyLayout
