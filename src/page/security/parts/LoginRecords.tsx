import { SecurityPageStore } from '../UseSecurityPageStore'
import { LoginLog } from '../interface'
import { ChUtils } from 'ch-ui'
import React from 'react'

export default function LoginRecords() {
    const { loginLogs } = SecurityPageStore.useContainer()
    return (
        <div className="security-login-records p-b-70">
            <div className="certificate-list-th flex-row-center">登录历史</div>
            <div className="security-record-header certificate-list-item flex-between">
                <div style={{ width: 300 }} className="security-record-header-item">
                    时间
                </div>
                <div style={{ width: 500 }} className="security-record-header-item">
                    所在地
                </div>
                <div className="security-record-header-item">IP地址</div>
            </div>
            {loginLogs.map((loginLog: LoginLog, index: number) => {
                return (
                    <div key={loginLog.id} className={index % 2 == 0 ? 'security-record-header certificate-list-item_gray flex-between' : 'security-record-header certificate-list-item flex-between'}>
                        <div style={{ width: 300 }} className="security-record-item">
                            {ChUtils.chFormats.formatDate(Number(loginLog.login_time) * 1000)}
                        </div>
                        <div style={{ width: 500 }} className="security-record-item">
                            {loginLog.login_address}
                        </div>
                        <div className="security-record-item">{loginLog.login_ip}</div>
                    </div>
                )
            })}
        </div>
    )
}
