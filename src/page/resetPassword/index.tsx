import React, { useState } from 'react'
import '../register/index.less'
import { Button, Menu, Input, Checkbox, Modal, message } from 'antd'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import VerificationCodeInput from '../../component/from/ChVerificationCodeInput'
import { createContainer, useContainer } from 'unstated-next'
import { MenuInfo } from 'rc-menu/lib/interface'
import { useForm } from 'antd/lib/form/Form'
import { useHistory } from 'react-router-dom'
import { FormDataItem } from 'ch-ui/src/component/ChForm/index'

type RegistrationMethod = 'email' | 'phone'

function useRegisterPageStore() {
    const [modal] = Modal.useModal()
    const [formRef] = useForm()
    const history = useHistory()
    const [registrationMethod, setRegistrationMethod] = useState<RegistrationMethod>('phone')
    const register = (ticket: string, randstr: string) => {
        formRef.validateFields().then((values) => {
            ChUtils.Ajax.request({
                url: '/api/forget',
                method: 'post',
                data: {
                    code: values.code,
                    username: values.username,
                    password: values.password,
                    towpwd: values.towpwd,
                    tuijian: values.tuijian,
                    style: registrationMethod == 'email' ? 'email' : 'mobile',
                    ticket,
                    randstr,
                },
            }).then((res: { code: number; msg: string; data: any }) => {
                if (res.code === 0) {
                    Modal.info({
                        title: '恭喜重置成功！',
                        okText: '去登录',
                        onOk: () => {
                            history.push('/login')
                        },
                        content: <div> 请点击确认跳转登录 </div>,
                    })
                }
            })
        })
    }
    return {
        formRef,
        registrationMethod,
        setRegistrationMethod,
        register,
    }
}

const RegisterPageStore = createContainer(useRegisterPageStore)

function RegisterForm(): JSX.Element {
    const { registrationMethod, formRef } = useContainer(RegisterPageStore)
    console.log('RegisterForm', registrationMethod)
    const onGetCode = async () => {
        try {
            const values = await formRef.validateFields(['username'])
            message.success('验证码发送成功')
            if (registrationMethod === 'phone') {
                ChUtils.Ajax.request({
                    url: '/api/get_mobile_code',
                    data: {
                        style: 'forget',
                        mobile: values.username,
                    },
                })
                return true
            } else {
                ChUtils.Ajax.request({
                    url: '/api/get_email_code',
                    data: {
                        style: 'forget',
                        email: values.username,
                    },
                })
                return true
            }
        } catch (e) {
            return false
        }
    }
    const formData: FormDataItem[] = [
        {
            type: FormItemType.input,
            label: '',
            name: 'username',
            placeholder: registrationMethod === 'email' ? '邮箱' : '手机号',
            rules: [{ required: true, message: '请输入' + registrationMethod === 'email' ? '邮箱' : '手机号' }],
        },
        {
            type: FormItemType.other,
            dom: <VerificationCodeInput onGetCode={onGetCode} />,
            label: '',
            name: 'code',
            rules: [{ required: true, message: '请输入验证码' }],
        },
        {
            type: FormItemType.password,
            label: '',
            name: 'password',
            placeholder: '设置密码',
            rules: [
                {
                    required: true,
                    message: '请输入新密码!',
                },
            ],
        },
        {
            type: FormItemType.password,
            label: '',
            name: 'towpwd',
            placeholder: '确认密码',
            rules: [
                {
                    required: true,
                    message: '请重复新密码！',
                },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve()
                        }
                        return Promise.reject(new Error('两次输入的密码不匹配'))
                    },
                }),
            ],
        },
    ]
    return <ChForm form={formRef} formData={formData} />
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
                    <div className="register-type-select-item">手机重置</div>
                </Menu.Item>
                <Menu.Item className="m-l-20 register-type-select-wrap" key="email">
                    <div className="register-type-select-item">邮箱重置</div>
                </Menu.Item>
            </Menu>
        </div>
    )
}

function Register(): JSX.Element {
    const { register, formRef } = RegisterPageStore.useContainer()
    const submit = () => {
        const loginVerifyCallBack = (res: any) => {
            console.log('callback:', res)
            // res（用户主动关闭验证码）= {ret: 2, ticket: null}
            // res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
            if (res.ret === 0) {
                // 蒙蔽接口反了
                register(res.ticket, res.randstr)
            }
        }
        formRef.validateFields().then((res) => {
            try {
                const captcha1 = new TencentCaptcha('2006315435', loginVerifyCallBack)
                captcha1.show() // 显示验证码
            } catch (error) {
                // loadErrorCallback()
            }
        })
    }
    return (
        <div className="register-page flex-column-all-center">
            <div className="register-header m-b-20" />
            <div className="register-card">
                <div className="register-title">重置密码</div>
                <RegisterTypeSelect />
                <div className="m-t-30">
                    <RegisterForm />
                    <Button onClick={submit} className="register-button" type="primary">
                        提交
                    </Button>
                    <div className="m-b-30 register-to-login">
                        跳转<a href="/login">登录</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default () => (
    <RegisterPageStore.Provider>
        <Register />
    </RegisterPageStore.Provider>
)
