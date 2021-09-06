import { SecurityPageStore } from '../UseSecurityPageStore'
import { GlobalStore } from '../../../store/globalStore'
import { ChUtils } from 'ch-ui'
import React from 'react'
import { message, Tag } from 'antd'

export default function CertificateList() {
    const { setModalChangePhoneShow, setModalBindGoogleAuthShow, setModalChangeEmailShow, setModalChangePasswordShow, setModalChangePaymentCodeShow } = SecurityPageStore.useContainer()
    const { userInfo } = GlobalStore.useContainer()
    const securityLevel = userInfo.mobile_auth + userInfo.google_auth + userInfo.email_auth
    const levelName = securityLevel === 3 ? '高' : securityLevel === 2 ? '中' : '低'
    const bindGoogleAuth = () => {
        if (!userInfo.mobile_auth || !userInfo.email_auth) {
            message.error('请先绑定手机和邮箱')
            return
        }
        setModalBindGoogleAuthShow(true)
    }
    return (
        <div>
            <div className="certificate-list p-b-50">
                <div className="certificate-list-th flex-row-center">双重身份认证</div>
                <div className="certificate-list-item flex-between">
                    <div className="security-label">安全级别：{levelName}</div>
                    <div className="security-level flex-center">
                        {securityLevel > 0 &&
                            new Array(securityLevel).fill(1).map((_, index) => {
                                return <div key={index} className="security-level-line_active" />
                            })}
                        {securityLevel < 3 &&
                            new Array(3 - securityLevel).fill(1).map((_, index) => {
                                return <div key={index} className="security-level-line" />
                            })}
                    </div>
                </div>
                <div className="certificate-list-item_gray flex-between">
                    <div className="security-label">
                        <div>手机</div>
                        <div className="security-certificate-tip">用于登陆、提币、找回密码、修改安全设置、管理API时进行安全验证</div>
                    </div>
                    <div className="flex-center security-phone">
                        {userInfo.mobile_auth !== 0 && <div>{ChUtils.chFormats.phoneNumberHideMiddle(userInfo.mobile!)}</div>}
                        <div onClick={() => setModalChangePhoneShow(true)} className="security-change-phone">
                            {userInfo.mobile_auth ? <span>更换手机</span> : <span className="text-modal-tip">绑定手机</span>}
                        </div>
                    </div>
                </div>
                <div className="certificate-list-item flex-between">
                    <div className="security-label">
                        <div>邮箱</div>
                        <div className="security-certificate-tip">用于登陆、提币、找回密码、修改安全设置、管理API时进行安全验证</div>
                    </div>
                    <div className="flex-center security-phone">
                        {userInfo.email_auth !== 0 && <div>{ChUtils.chFormats.emailHideMiddle(userInfo.email!)}</div>}
                        <div
                            onClick={() => {
                                setModalChangeEmailShow(true)
                            }}
                            className="security-change-phone"
                        >
                            {userInfo.email_auth ? <span>更换邮箱</span> : <span className="text-modal-tip">绑定邮箱</span>}
                        </div>
                    </div>
                </div>
                <div className="certificate-list-item_gray flex-between">
                    <div className="security-label">
                        <div>谷歌验证器</div>
                        <div className="security-certificate-tip">用于登陆、提币、找回密码、修改安全设置、管理API时进行安全验证</div>
                    </div>
                    <div className="flex-center security-phone">
                        <div onClick={bindGoogleAuth} className="security-change-phone">
                            {userInfo.google_auth !== 0 && <Tag color="#87d068">已绑定</Tag>}
                            {userInfo.google_auth === 0 ? <span className="text-modal-tip">绑定谷歌验证器</span> : '更换谷歌验证器'}
                        </div>
                    </div>
                </div>
            </div>
            <div className="certificate-list p-b-20">
                <div className="certificate-list-th flex-row-center">密码管理</div>
                <div className="certificate-list-item flex-between">
                    <div className="security-label">
                        <div>登录密码</div>
                        <div className="security-certificate-tip">用于保护账号安全</div>
                    </div>
                    <div className="flex-center security-phone">
                        <div
                            onClick={() => {
                                setModalChangePasswordShow(true)
                            }}
                            className="security-change-phone"
                        >
                            更改
                        </div>
                    </div>
                </div>
                <div className="certificate-list-item_gray flex-between">
                    <div className="security-label">
                        <div>操作密码</div>
                        <div className="security-certificate-tip">用于保护资产安全</div>
                    </div>
                    <div className="flex-center security-phone">
                        <div
                            onClick={() => {
                                setModalChangePaymentCodeShow(true)
                            }}
                            className="security-change-phone"
                        >
                            更改
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
