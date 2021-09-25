import { Button, Layout, Badge } from 'antd'
import React, { useEffect, useState } from 'react'
import './index.less'
import { Menu } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import { SyncOutlined, LogoutOutlined } from '@ant-design/icons'
import { GlobalStore } from '../store/globalStore'
import SystemNotification from '../component/modal/SystemNotification'
import { ChUtils } from 'ch-ui'
let intervalId: any
const { Header } = Layout

const LayoutConfig = {
    headerMenus: [
        {
            path: '/',
            name: '首页',
        },
        {
            path: '/capital',
            name: '资金',
        },
        {
            path: '/security',
            name: '安全',
        },
        {
            path: '/applicationCenter',
            name: '应用中心',
        },
        {
            path: '/developDocument',
            name: '开发文档',
        },
    ],
}

function LayoutHeader() {
    const location = useLocation()
    const history = useHistory()
    const [currentPath, setCurrentPath] = useState('')
    const { headerMenus } = LayoutConfig
    const { currentApp, notificationTipCount, setModalSystemNotificationShow, setCurrentApp } = GlobalStore.useContainer()
    useEffect(() => {
        setCurrentPath('/' + location.pathname.split('/')[1])
    }, [location.pathname])

    const logout = () => {
        ChUtils.Ajax.request({
            url: '/api/login_out',
        })
        setCurrentApp(undefined)
        window.location.href = '/login'
    }
    return (
        <Header style={{ background: '#23282B' }} className="flex-center">
            <div className="layout-header flex-row-between">
                <div className="flex-center">
                    {currentApp ? (
                        <div
                            onClick={() => {
                                history.push('/application')
                            }}
                            className={location.pathname === '/application' ? 'layout-change-application active flex-center' : 'layout-change-application flex-center'}
                        >
                            <div className="flex-center">
                                <img className="header-logo" src={currentApp?.logo}></img>
                                <div className="header-app-name">{currentApp ? currentApp.app_name : '--'}</div>
                            </div>
                            <SyncOutlined />
                            <span className="m-l-5">{currentApp ? '切换' : '选择应用'}</span>
                        </div>
                    ) : (
                        <div className="layout-logo"></div>
                    )}
                    <div className="layout-splitline"></div>
                    <Menu defaultSelectedKeys={['/' + location.pathname.split('/')[1]]} selectedKeys={[currentPath]} theme="dark" className="layout-menu" mode="horizontal">
                        {headerMenus.map((item) => {
                            return (
                                <Menu.Item
                                    key={item.path}
                                    onClick={() => {
                                        history.push(item.path)
                                    }}
                                >
                                    {item.name}
                                </Menu.Item>
                            )
                        })}
                        <Menu.Item key="6">上币申请</Menu.Item>
                        {/*<Menu.Item key="7">商户中心</Menu.Item>*/}
                    </Menu>
                </div>
                <div className="flex-center layout-header-right">
                    <a className="flex-center" onClick={() => setModalSystemNotificationShow(true)}>
                        <Badge offset={[-68, 0]} size="small" overflowCount={99} count={notificationTipCount}>
                            <div style={{ cursor: 'pointer' }} className="flex-center layout-header-option m-r-10">
                                <span style={{ fontSize: '19px', position: 'relative', top: '-1px' }} className="iconfont icon-xiaoxi" />
                                消息
                            </div>
                        </Badge>
                    </a>
                    <div onClick={logout} className="layout-header-option m-b-3">
                        <LogoutOutlined style={{ fontSize: 17, marginRight: 2, position: 'relative', top: '1px' }} />
                        退出
                    </div>
                </div>
            </div>
        </Header>
    )
}

function AdminLayout({ children }: { children: JSX.Element }) {
    const { fetchUserInfo, getNotification } = GlobalStore.useContainer()
    useEffect(() => {
        fetchUserInfo()
    }, [])
    useEffect(() => {
        getNotification()
        intervalId = setInterval(() => {
            getNotification().catch((res) => {
                clearInterval(intervalId)
            })
        }, 10000)
        return () => {
            clearInterval(intervalId)
        }
    }, [])
    return (
        <div className="admin-layout">
            <LayoutHeader />
            <SystemNotification />
            <div className="layout-content">{children}</div>
        </div>
    )
}

function MyLayout({ children }: { children: JSX.Element }) {
    const location = useLocation()
    const noLoginPaths = ['resetPassword', 'login', 'register']
    const showAdminLayout = noLoginPaths.some((item) => {
        return location.pathname.includes(item)
    })
    return <div className="layout">{showAdminLayout ? <>{children}</> : <AdminLayout>{children}</AdminLayout>}</div>
}

export default MyLayout
