import React from 'react'
import Layout from './layout/index'
import './index.less'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import loadable from '@loadable/component'
import Capital from './page/capital'
import Login from './page/login'
import Register from './page/register'

export function App() {
    return (
        <Router>
            <Route path="/login">
                <Login />
            </Route>
            <Route path="/register">
                <Register />
            </Route>
            <Layout>
                <Switch>
                    <Route path="/">
                        <Capital />
                    </Route>
                </Switch>
            </Layout>
        </Router>
    )
}

export default <App />
