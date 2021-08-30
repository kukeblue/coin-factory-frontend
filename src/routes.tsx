import React from 'react'
import Capital from './page/capital'
import Login from './page/login'
import Register from './page/register'
import Home from './page/home'

export const routes = [
    {
        path: '/login',
        component: <Login />,
    },
    {
        path: '/register',
        component: <Register />,
    },
]

export const needLoginRoutes = [
    {
        path: '/capital',
        component: <Capital />,
    },
    {
        path: '/',
        component: <Home />,
    },
]
