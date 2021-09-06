import { SecurityPageStore } from '../UseSecurityPageStore'
import { GlobalStore } from '../../../store/globalStore'
import { ChUtils } from 'ch-ui'
import React from 'react'

export default function Header() {
    const { loginLogs } = SecurityPageStore.useContainer()
    const { userInfo } = GlobalStore.useContainer()
    const lastLoginTime = loginLogs[0] ? ChUtils.chFormats.formatDate(Number(loginLogs[0].last_login_time) * 1000) : '--'
    return (
        <div className="security-header flex-row-center">
            <div className="security-header-avatar"></div>
            <div className="m-l-30">
                <div className="flex-row-center">
                    <div className="security-header-username">Hi,{userInfo?.nickname !== '暂无设置' ? userInfo?.nickname : userInfo?.email || userInfo.mobile}</div>
                    <div className="security-header-uid flex-row-center p-l-10">UID:{userInfo?.uid}</div>
                </div>
                <div className="flex-row-center">
                    <div className="security-header-info">
                        最后登录时间：{lastLoginTime} &nbsp;&nbsp;&nbsp;IP: {userInfo?.current_ip}
                    </div>
                    <div className="m-l-20 security-view-allrecord flex-center">查看完整记录</div>
                </div>
            </div>
        </div>
    )
}
