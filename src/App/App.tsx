import React from 'react'
import Layout from '../layout'
import './index.less'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import loadable from '@loadable/component'
import { routes, needLoginRoutes } from './routes'
import Home from '../page/home'
import { GlobalStore } from '../store/globalStore'
import zhCN from 'antd/lib/locale/zh_CN'
import { ConfigProvider, Spin } from 'antd'

export function App() {
    return (
        <Router>
            <Layout>
                <Switch>
                    {routes.map((item) => {
                        return (
                            <Route exact key={item.path} path={item.path}>
                                {item.component}
                            </Route>
                        )
                    })}

                    {needLoginRoutes.map((item) => {
                        const DOM = loadable(() => import('../page' + item.path), {
                            fallback: (
                                <Spin tip={'loading'} spinning>
                                    <div style={{ width: '100%', height: '100%' }} />
                                </Spin>
                            ),
                        })
                        return (
                            <Route key={item.path} path={item.routerPath}>
                                <DOM />
                            </Route>
                        )
                    })}
                    <Route exact key="home" path="/">
                        <Home />
                    </Route>
                </Switch>
            </Layout>
        </Router>
    )
}

export default (
    <ConfigProvider locale={zhCN}>
        <GlobalStore.Provider>
            <App />
        </GlobalStore.Provider>
    </ConfigProvider>
)
