import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import { ChUtils } from 'ch-ui'
import { VerificationCodeType, IUserInfo } from '../typings'
import { defaultUserInfo } from './initializedData'
import { message } from 'antd'
import chHooks from '../utils/chHooks'
import { useHistory } from 'react-router-dom'
const chCache = ChUtils.chCache
function useGlobalStore() {
    const [currentApp, setCurrentApp] = useState<IApplication | undefined | null>()
    const [userInfo, setUserInfo] = useState<IUserInfo>(defaultUserInfo)
    const [notificationTipCount, setNotificationTipCount] = useState(0)
    const [modalSystemNotificationShow, setModalSystemNotificationShow] = useState(false)
    const history = useHistory()
    useEffect(() => {
        if (!userInfo || !currentApp) return
        chCache.setObCache('currentApp_' + userInfo.uid, currentApp)
    }, [currentApp])

    const getNotification = async () => {
        if (!userInfo) return
        const res = await ChUtils.Ajax.request({
            url: '/api/get_remind',
        })
        if (res.code !== 0) {
            throw Error('need login')
        }
        setNotificationTipCount(res.data)
    }

    useEffect(() => {
        if (!userInfo) return
        const currentApp = chCache.getObCache('currentApp_' + userInfo.uid)
        if (currentApp) {
            setCurrentApp(currentApp)
        } else {
            ChUtils.Ajax.request({
                url: '/api/get_app_list',
            }).then((res) => {
                if (res.code === 0) {
                    if (res.data && res.data.length > 0) {
                        setCurrentApp(res.data[0])
                    } else {
                        // history.push('/application')
                    }
                }
            })
        }
    }, [userInfo])

    const fetchUserInfo = () => {
        ChUtils.Ajax.request({
            url: '/api/get_user_info',
            method: 'post',
            data: {},
        }).then((res) => {
            if (res.code === 0) {
                setUserInfo(res.data)
            }
        })
    }

    const sendPhoneCode = async (scene: string, payload?: Object): Promise<Boolean> => {
        if (!(userInfo && userInfo.mobile_auth)) {
            message.error('请先绑定手机号')
            return false
        }
        const res = await ChUtils.Ajax.request({
            url: '/api/get_mobile_code',
            data: payload ? { style: scene, mobile: userInfo.mobile, ...payload } : { style: scene },
            method: 'post',
        })
        if (res.code === 0) {
            message.success('验证码发送成功')
            return true
        }
        return false
    }

    const sendEmailCode = async (scene: string, payload?: Object): Promise<Boolean> => {
        if (!(userInfo && userInfo.email_auth)) {
            message.error('请先绑定邮箱')
            return false
        }
        const res = await ChUtils.Ajax.request({
            url: '/api/get_email_code',
            data: payload ? { style: scene, mobile: userInfo.email, ...payload } : { style: scene },
            method: 'post',
        })
        if (res.code === 0) {
            message.success('验证码发送成功')
            return true
        }
        return false
    }

    const fetchAuthCode = (v: VerificationCodeType, scene: string, payload?: Object): Promise<Boolean> => {
        switch (v) {
            case 'phone':
                return sendPhoneCode(scene, payload)
            case 'email':
                return sendEmailCode(scene, payload)
            default:
                return new Promise((resolve, reject) => {
                    resolve(false)
                })
        }
    }

    return {
        userInfo,
        currentApp,
        setCurrentApp,
        fetchUserInfo,
        fetchAuthCode,
        notificationTipCount,
        modalSystemNotificationShow,
        setModalSystemNotificationShow,
        getNotification,
    }
}

export const GlobalStore = createContainer(useGlobalStore)
