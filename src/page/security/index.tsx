import { Alert, Modal, Radio } from 'antd'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import React, { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import './index.less'
import constants from '../../config/constants'
import { IUserInfo, defaultUserInfo, LoginLog } from './interface'
import VerificationCodeInput from '../../component/from/ChVerificationCodeInput'
import { useForm } from 'antd/lib/form/Form'

function UseSecurityPageStore() {
    const [userInfo, setUserInfo] = useState<IUserInfo>(defaultUserInfo)
    const [loginLogs, setLoginLogs] = useState<LoginLog[]>([])
    const [modalChangePhoneShow, setModalChangePhoneShow] = useState(false)
    useEffect(() => {
        getUserInfo()
        getLoginLog()
    }, [])

    const getUserInfo = () => {
        ChUtils.Ajax.request({
            url: '/api/get_user_info',
            method: 'post',
            data: {},
        }).then((res) => {
            if (res.data) {
                if (res.data.nickname == '暂无设置') {
                    res.data.nickname = undefined
                }
                setUserInfo(res.data)
            }
        })
    }

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
        userInfo,
        modalChangePhoneShow,
        setModalChangePhoneShow,
    }
}

const SecurityPageStore = createContainer(UseSecurityPageStore)

function Header() {
    const { userInfo, loginLogs } = SecurityPageStore.useContainer()
    const lastLoginTime = loginLogs[0] ? ChUtils.chFormats.formatDate(Number(loginLogs[0].last_login_time) * 1000) : '--'
    return (
        <div className="security-header flex-row-center">
            <div className="security-header-avatar"></div>
            <div className="m-l-30">
                <div className="flex-row-center">
                    <div className="security-header-username">Hi,{userInfo?.nickname || userInfo?.email}</div>
                    <div className="security-header-uid flex-row-center p-l-10">UID:{userInfo?.uid}</div>
                </div>
                <div className="flex-center">
                    <div className="security-header-info">
                        最后登录时间：{lastLoginTime} &nbsp;&nbsp;&nbsp;IP: {userInfo?.current_ip}
                    </div>
                    <div className="m-l-20 security-view-allrecord flex-center">查看完整记录</div>
                </div>
            </div>
        </div>
    )
}

function SecurityCertificateStatus() {
    const { userInfo } = SecurityPageStore.useContainer()

    return (
        <div className="security-certificate">
            <div>个人认证</div>
            <div className="security-certificate-tip m-t-5">完成个人认证有助于保护账户安全，提高提现额度及交易权限</div>
            <div className="m-t-15">
                <Radio checked={userInfo.mobile_auth == 1}>手机认证</Radio>
                <Radio checked={userInfo.email_auth == 1}>邮箱认证</Radio>
                <Radio checked={userInfo.google_auth == 1}>谷歌认证</Radio>
            </div>
        </div>
    )
}

function CertificateList() {
    const { userInfo, setModalChangePhoneShow } = SecurityPageStore.useContainer()
    const securityLevel = userInfo.mobile_auth + userInfo.google_auth + userInfo.email_auth
    const levelName = securityLevel === 3 ? '高' : securityLevel === 2 ? '中' : '低'

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
                        {userInfo.mobile && <div>{ChUtils.chFormats.phoneNumberHideMiddle(userInfo.mobile)}</div>}
                        <div onClick={() => setModalChangePhoneShow(true)} className="security-change-phone">
                            更换手机
                        </div>
                    </div>
                </div>
                <div className="certificate-list-item flex-between">
                    <div className="security-label">
                        <div>邮箱</div>
                        <div className="security-certificate-tip">用于登陆、提币、找回密码、修改安全设置、管理API时进行安全验证</div>
                    </div>
                    <div className="flex-center security-phone">
                        {userInfo.email && <div>{ChUtils.chFormats.emailHideMiddle(userInfo.email)}</div>}
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

function LoginRecords() {
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
            {loginLogs.map((loginLog, index) => {
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

function ModalChangePhone() {
    const [formRef] = useForm()
    const { setModalChangePhoneShow, modalChangePhoneShow } = SecurityPageStore.useContainer()
    const getMobileVerificationCode = async () => {
        const { mobile } = await formRef.validateFields(['mobile'])
        const res = await ChUtils.Ajax.request({
            url: '/api/get_mobile_code',
            method: 'post',
            data: {
                style: 'register',
                mobile,
            },
        })
        if (res.code !== -1) {
            return true
        } else {
            return false
        }
    }

    return (
        <Modal visible={modalChangePhoneShow} okText="确定" cancelText="取消" className="modalChangePhone" onCancel={() => setModalChangePhoneShow(false)}>
            <div className="title-modal flex-center">修改密码</div>
            <div className="m-t-20 m-b-20">
                <Alert className="modalChangePhone-alert" type="warning" showIcon message="为了您的资金安全，修改手机号24内不能提现"></Alert>
            </div>
            <ChForm
                form={formRef}
                formData={[
                    {
                        type: FormItemType.input,
                        name: 'mobile',
                        label: '新手机号',
                        placeholder: '请输入新手机号',
                        rules: [
                            {
                                required: true,
                                message: '请输入手机号!',
                            },
                            {
                                required: false,
                                message: '请输入正确的手机号!',
                                validator: (_, value) => {
                                    if (value === '' || !value) {
                                        return Promise.resolve()
                                    }
                                    console.log(value, ChUtils.chValidator.validatePhone(value))
                                    return ChUtils.chValidator.validatePhone(value) ? Promise.resolve() : Promise.reject(new Error('Should accept agreement'))
                                },
                            },
                        ],
                    },
                    {
                        type: FormItemType.other,
                        dom: <VerificationCodeInput onGetCode={getMobileVerificationCode} />,
                        name: 'mobile_code',
                        label: '短信验证码',
                    },
                    {
                        type: FormItemType.other,
                        dom: <VerificationCodeInput />,
                        name: 'email_code',
                        label: '邮箱验证码',
                    },
                ]}
            />
        </Modal>
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
                <LoginRecords />
                <ModalChangePhone />
            </div>
        </div>
    )
}

export default () => (
    <SecurityPageStore.Provider>
        <SecurityPage />
    </SecurityPageStore.Provider>
)
