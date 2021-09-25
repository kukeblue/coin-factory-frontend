import React from 'react'
import { Alert, Menu } from 'antd'
import constants from '../../../config/constants'
import { BrowserRouter as Router, Route, Switch, useHistory, useLocation } from 'react-router-dom'
import './index.less'

function CommonPage(props: { pageRouters?: { isChildPage?: boolean; path: string; name: string; component?: JSX.Element; icon?: JSX.Element }[]; pageIcon?: string | JSX.Element; pageName?: string }) {
    const history = useHistory()
    const location = useLocation()
    const commonPageRouters = props.pageRouters || []
    const _pageName = props.pageName || '空白页'

    return (
        <div className="common-page">
            <div className="p-t-10 p-b-10">{false && <Alert message={constants.rechargeTip} type="warning" showIcon closable />}</div>
            <div className="common-page-body flex-center">
                <div className="common-page-side">
                    <div className="common-page-side-icon flex-column-all-center">
                        <div className="side-icon">{props.pageIcon}</div>
                        <div className="side-icon-text">{_pageName}</div>
                    </div>
                    <Menu className="m-t-80" defaultSelectedKeys={[location.pathname]} mode="inline">
                        {commonPageRouters.map((item) => {
                            if (item.isChildPage) return
                            return (
                                <Menu.Item
                                    key={item.path}
                                    onClick={() => {
                                        history.push(item.path)
                                    }}
                                    style={{ height: 55 }}
                                    className="common-page-side-item"
                                >
                                    <div className="common-page-menu-item flex-center">
                                        <span className="common-page-icon"> {item.icon} </span> <span>{item.name}</span>
                                    </div>
                                </Menu.Item>
                            )
                        })}
                    </Menu>
                </div>
                <div className="common-page-content">
                    {commonPageRouters.map((item, index) => {
                        return (
                            <Route key={index} exact={item.isChildPage ? false : true} path={item.path}>
                                {item.component || index}
                            </Route>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default CommonPage
