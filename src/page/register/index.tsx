import React, { useEffect, useState } from 'react'
import './index.less'
import { Button, Menu, Input, Checkbox, Modal, notification } from 'antd'
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
    useEffect(() => {
        if (formRef) {
            formRef.resetFields(['username'])
        }
    }, [registrationMethod])
    const register = (ticket: string, randstr: string) => {
        formRef.validateFields().then((values) => {
            ChUtils.Ajax.request({
                url: '/api/register',
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
            }).then((res) => {
                if (res.code !== -1) {
                    history.replace('/login')
                    notification.success({ message: '注册成功！请登录' })
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
            if (registrationMethod === 'phone') {
                ChUtils.Ajax.request({
                    url: '/api/get_mobile_code',
                    data: {
                        style: 'register',
                        mobile: values.username,
                    },
                })
                return true
            } else {
                ChUtils.Ajax.request({
                    url: '/api/get_email_code',
                    data: {
                        style: 'register',
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
            rules: [
                {
                    required: true,
                    message: '请输入',
                },
                registrationMethod === 'email'
                    ? { required: false, message: '请输入正确的邮箱', type: 'email' }
                    : {
                          required: true,
                          message: '请输入正确的手机号!',
                          validator: (_, value) => {
                              if (value === '' || !value) {
                                  return Promise.resolve()
                              }
                              return ChUtils.chValidator.validatePhone(value) ? Promise.resolve() : Promise.reject(new Error())
                          },
                      },
            ],
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
        {
            type: FormItemType.other,
            label: '',
            name: 'tuijian',
            dom: (
                <div style={{ position: 'relative', top: -10 }}>
                    <div className="register-invitationCode-label">邀请码（选填）</div>
                    <Input placeholder="邀请码" />
                </div>
            ),
        },
    ]
    return <ChForm form={formRef} formData={formData} />
}

function RegisterTypeSelect(): JSX.Element {
    const { registrationMethod, setRegistrationMethod } = useContainer(RegisterPageStore)
    const handleClick = (menuInfo: MenuInfo) => {
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
                <div className="register-title">注册账号</div>
                <RegisterTypeSelect />
                <div className="m-t-30">
                    <RegisterForm />
                    <div className="register-agreement">
                        <Checkbox checked={true} className="m-r-5" />
                        我已阅读同意 <a>《用户协议》</a>和 <a>《隐私条件》</a>
                    </div>
                    <Button onClick={submit} className="register-button" type="primary">
                        注册
                    </Button>
                    <div className="m-b-30 register-to-login">
                        已有账号跳转<a href="/login">登录</a>
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
