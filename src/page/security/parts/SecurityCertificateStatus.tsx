import { GlobalStore } from '../../../store/globalStore'
import { Radio } from 'antd'
import React from 'react'

export default function SecurityCertificateStatus() {
    const { userInfo } = GlobalStore.useContainer()

    return (
        <div className="security-certificate">
            <div>个人认证</div>
            <div className="security-certificate-tip m-t-5">完成个人认证有助于保护账户安全，提高提现额度及交易权限</div>
            <div className="m-t-15">
                <Radio checked={userInfo?.mobile_auth == 1}>手机认证</Radio>
                <Radio checked={userInfo?.email_auth == 1}>邮箱认证</Radio>
                <Radio checked={userInfo?.google_auth == 1}>谷歌认证</Radio>
            </div>
        </div>
    )
}
