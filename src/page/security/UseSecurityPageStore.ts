import { useEffect, useState } from 'react'
import { LoginLog } from './interface'
import { ChUtils } from 'ch-ui'
import { createContainer } from 'unstated-next'

export function UseSecurityPageStore() {
    const [loginLogs, setLoginLogs] = useState<LoginLog[]>([])
    const [modalChangePhoneShow, setModalChangePhoneShow] = useState(false)
    const [modalChangeEmailShow, setModalChangeEmailShow] = useState(false)
    const [modalChangePasswordShow, setModalChangePasswordShow] = useState(false)
    const [modalBindGoogleAuthShow, setModalBindGoogleAuthShow] = useState(false)
    const [modalChangePaymentCodeShow, setModalChangePaymentCodeShow] = useState(false)

    useEffect(() => {
        getLoginLog()
    }, [])

    const getLoginLog = () => {
        ChUtils.Ajax.request({
            url: '/api/get_login_log',
            method: 'post',
            data: {
                page: 1,
                limit: 10,
            },
        }).then((res) => {
            setLoginLogs(res.data.list)
        })
    }

    return {
        loginLogs,
        modalChangePhoneShow,
        setModalChangePhoneShow,
        modalBindGoogleAuthShow,
        setModalBindGoogleAuthShow,
        modalChangeEmailShow,
        setModalChangeEmailShow,
        modalChangePasswordShow,
        setModalChangePasswordShow,
        modalChangePaymentCodeShow,
        setModalChangePaymentCodeShow,
    }
}

export const SecurityPageStore = createContainer(UseSecurityPageStore)
