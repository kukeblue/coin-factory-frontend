import { Alert, Radio } from 'antd'
import React, { useState } from 'react'
import './index.less'
import constants from '../../config/constants'
import { ChUtils } from 'ch-ui'
import { createContainer } from 'unstated-next'

function UseSecurityPageStore() {
    const [userInfo, setUserInfo] = useState()
    ChUtils.Ajax.request({
        url: '/api/get_user_info',
        method: 'post',
        data: {},
    }).then((res) => {
        console.log(res)
    })
    return {
        userInfo,
    }
}

const SecurityPageStore = createContainer(UseSecurityPageStore)

function Header() {
    return (
        <div className="security-header flex-row-center">
            <div className="security-header-avatar">
                <div></div>
            </div>
            <div className="m-l-35">
                <div className="flex-row-center">
                    <div className="security-header-username">Hi,刘XXX</div>
                    <div className="security-header-uid flex-center">UID:109827365</div>
                </div>
                <div className="flex-center">
                    <div className="security-header-info">最后登录时间：XXXXXX &nbsp;&nbsp;&nbsp;IP: xxxx</div>
                    <div className="m-l-20 security-view-allrecord flex-center">查看完整记录</div>
                </div>
            </div>
        </div>
    )
}

function SecurityCertificateStatus() {
    return (
        <div className="security-certificate">
            <div>个人认证</div>
            <div className="security-certificate-tip m-t-5">完成个人认证有助于保护账户安全，提高提现额度及交易权限</div>
            <div className="m-t-15">
                <Radio checked>手机认证</Radio>
                <Radio checked>邮箱认证</Radio>
                <Radio checked>谷歌认证</Radio>
            </div>
        </div>
    )
}

function CertificateList() {
    return (
        <div>
            <div className="certificate-list p-b-50">
                <div className="certificate-list-th flex-row-center">双重身份认证</div>
                <div className="certificate-list-item flex-between">
                    <div className="security-label">安全级别：高</div>
                    <div className="security-level flex-center">
                        <div className="security-level-line_active" />
                        <div className="security-level-line_active" />
                        <div className="security-level-line" />
                    </div>
                </div>
                <div className="certificate-list-item_gray flex-between">
                    <div className="security-label">
                        <div>手机</div>
                        <div className="security-certificate-tip">用于登陆、提币、找回密码、修改安全设置、管理API时进行安全验证</div>
                    </div>
                    <div className="flex-center security-phone">
                        <div>138****3382</div>
                        <div className="security-change-phone">更换手机</div>
                    </div>
                </div>
                <div className="certificate-list-item flex-between">
                    <div className="security-label">
                        <div>邮箱</div>
                        <div className="security-certificate-tip">用于登陆、提币、找回密码、修改安全设置、管理API时进行安全验证</div>
                    </div>
                    <div className="flex-center security-phone">
                        <div>821****@qq.com</div>
                        <div className="security-change-phone">更换邮箱</div>
                    </div>
                </div>
                <div className="certificate-list-item_gray flex-between">
                    <div className="security-label">
                        <div>谷歌验证器</div>
                        <div className="security-certificate-tip">用于登陆、提币、找回密码、修改安全设置、管理API时进行安全验证</div>
                    </div>
                    <div className="flex-center security-phone">
                        <div className="security-change-phone">更换谷歌验证器</div>
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
                        <div className="security-change-phone">更改</div>
                    </div>
                </div>
                <div className="certificate-list-item_gray flex-between">
                    <div className="security-label">
                        <div>操作密码</div>
                        <div className="security-certificate-tip">用于保护资产安全</div>
                    </div>
                    <div className="flex-center security-phone">
                        <div className="security-change-phone">更改</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LonigRecords() {
    return (
        <div className="security-login-records p-b-70">
            <div className="certificate-list-th flex-row-center">登录历史</div>
            <div className="security-record-header certificate-list-item flex-between">
                <div style={{ width: 200 }} className="security-record-header-item">
                    时间
                </div>
                <div className="security-record-header-item">所在地</div>
                <div className="security-record-header-item">IP地址</div>
            </div>
            <div className="security-record-header certificate-list-item_gray flex-between">
                <div style={{ width: 200 }} className="security-record-item">
                    2021-06-24,15:26:18
                </div>
                <div className="security-record-item">深圳</div>
                <div className="security-record-item">106.6.99.116</div>
            </div>
        </div>
    )
}

function SecurityPage() {
    return (
        <div className="security-page">
            <div className="p-t-10 p-b-10">
                <Alert message={constants.rechargeTip} type="warning" showIcon closable />
            </div>
            <div className="security-content">
                <Header />
                <SecurityCertificateStatus />
                <CertificateList />
                <LonigRecords />
            </div>
        </div>
    )
}

export default () => (
    <SecurityPageStore.Provider>
        <SecurityPage />
    </SecurityPageStore.Provider>
)
