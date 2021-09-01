import React from 'react'
import Layout from './layout/index'
import './index.less'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import loadable from '@loadable/component'
import { routes, needLoginRoutes } from './routes'

export function App() {
    return (
        <Router>
            {routes.map((item) => {
                return (
                    <Route exact key={item.path} path={item.path}>
                        {item.component}
                    </Route>
                )
            })}
            <Layout>
                <Switch>
                    {needLoginRoutes.map((item) => {
                        const DOM = loadable(() => import('./page' + item.path), {
                            fallback: <div>loading...</div>,
                        })
                        return (
                            <Route exact key={item.path} path={item.routerPath}>
                                <DOM />
                            </Route>
                        )
                    })}
                </Switch>
            </Layout>
        </Router>
    )
}

export default <App />
