import React from 'react'
import Login from '../page/login'
import Register from '../page/register'
import ResetPassword from '../page/resetPassword'
export const routes = [
    {
        path: '/login',
        component: <Login />,
    },
    {
        path: '/register',
        component: <Register />,
    },
    {
        path: '/resetPassword',
        component: <ResetPassword />,
    },
]

export const needLoginRoutes = [
    {
        path: '/capital',
        routerPath: '/capital',
    },
    {
        path: '/security',
        routerPath: '/security',
    },
    {
        path: '/application',
        routerPath: '/application',
    },
    {
        path: '/applicationCenter',
        routerPath: '/applicationCenter',
    },
    {
        path: '/developDocument',
        routerPath: '/developDocument',
    },
]
