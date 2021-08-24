import React from 'react'
import Layout from './layout/index'
import './index.less'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import loadable from '@loadable/component'
import Home from './page/home'
import Login from './page/login'
import Register from './page/register'

const About = loadable(() => import('./page/about'), {
    fallback: <div>loading</div>,
})
export function App() {
    return (
        <Router>
            <Layout>
                <Switch>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/register">
                        <Register />
                    </Route>

                    <Route path="/about">
                        <About />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </Layout>
        </Router>
    )
}

export default <App />
