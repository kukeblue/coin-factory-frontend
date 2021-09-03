import React, { useState } from 'react'
import './index.less'
import { Button, Menu, Input, Checkbox } from 'antd'
import { ChForm, FormItemType } from 'ch-ui'
import VerificationCodeInput from '../../component/from/ChVerificationCodeInput'
import { createContainer, useContainer } from 'unstated-next'
import { MenuInfo } from 'rc-menu/lib/interface'

type RegistrationMethod = 'email' | 'phone'

function useRegisterPageStore() {
    const [registrationMethod, setRegistrationMethod] = useState<RegistrationMethod>('phone')
    return {
        registrationMethod,
        setRegistrationMethod,
    }
}

const RegisterPageStore = createContainer(useRegisterPageStore)

function RegisterForm(): JSX.Element {
    const { registrationMethod } = useContainer(RegisterPageStore)
    console.log('RegisterForm', registrationMethod)
    const formData = [
        {
            type: FormItemType.input,
            label: '',
            name: registrationMethod === 'email' ? 'email' : 'phone',
            placeholder: registrationMethod === 'email' ? '邮箱' : '手机号',
        },
        {
            type: FormItemType.other,
            dom: <VerificationCodeInput />,
            label: '',
            name: 'code',
        },
        {
            type: FormItemType.password,
            label: '',
            name: 'password',
            placeholder: '设置密码',
        },
        {
            type: FormItemType.password,
            label: '',
            name: 'confirmPassword',
            placeholder: '确认密码',
        },
        {
            type: FormItemType.other,
            label: '',
            name: 'invitationCode',
            dom: (
                <div style={{ position: 'relative', top: -10 }}>
                    <div className="register-invitationCode-label">邀请码（选填）</div>
                    <Input placeholder="邀请码" />
                </div>
            ),
        },
    ]
    return <ChForm formData={formData} />
}

function RegisterTypeSelect(): JSX.Element {
    const { registrationMethod, setRegistrationMethod } = useContainer(RegisterPageStore)
    const handleClick = (menuInfo: MenuInfo) => {
        console.log(menuInfo.key)
        setRegistrationMethod(menuInfo.key as RegistrationMethod)
    }
    return (
        <div className="register-type-select">
            <Menu onClick={handleClick} selectedKeys={[registrationMethod]} mode="horizontal">
                <Menu.Item className="register-type-select-wrap" key="phone">
                    <div className="register-type-select-item">手机注册</div>
                </Menu.Item>
                <Menu.Item className="m-l-20 register-type-select-wrap" key="email">
                    <div className="register-type-select-item">邮箱注册</div>
                </Menu.Item>
            </Menu>
        </div>
    )
}

function Register(): JSX.Element {
    return (
        <div className="register-page flex-column-all-center">
            <div className="register-header m-b-20"></div>
            <RegisterPageStore.Provider>
                <div className="register-card">
                    <div className="register-title">注册账号</div>
                    <RegisterTypeSelect />
                    <div className="m-t-30">
                        <RegisterForm />
                        <div className="register-agreement">
                            <Checkbox className="m-r-5" />
                            我已阅读同意 <a>《用户协议》</a>和 <a>《隐私条件》</a>
                        </div>
                        <Button className="register-button" type="primary">
                            注册
                        </Button>
                        <div className="m-b-30 register-to-login">
                            已有账号跳转<a href="/login">登录</a>
                        </div>
                    </div>
                </div>
            </RegisterPageStore.Provider>
        </div>
    )
}

export default Register
