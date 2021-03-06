import { Button } from 'antd'
import React, { useEffect, useMemo } from 'react'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import { createContainer, useContainer } from 'unstated-next'
import { useHistory } from 'react-router-dom'
import { useForm } from 'antd/lib/form/Form'
import './index.less'
import { GlobalStore } from '../../store/globalStore'

function useLoginPageStore() {
    const history = useHistory()
    const [formRef] = useForm()
    const { fetchUserInfo, setCurrentApp } = GlobalStore.useContainer()
    const login = (ticket: string, randstr: string) => {
        formRef.validateFields().then((values) => {
            ChUtils.Ajax.request({
                url: '/api/login',
                method: 'post',
                data: {
                    username: values.username,
                    password: values.password,
                    ticket,
                    randstr,
                },
            }).then((res: { code: number; msg: string; data: any }) => {
                if (res.code != -1) {
                    fetchUserInfo()
                    setCurrentApp(undefined)
                    history.push('/')
                }
            })
        })
    }
    const toRegister = () => {
        console.debug('debug: to do register')
        history.push('/register')
    }
    return {
        login,
        toRegister,
        formRef,
    }
}

const LoginPageStore = createContainer(useLoginPageStore)

function LoginCard() {
    const { login, toRegister, formRef } = useContainer(LoginPageStore)
    const history = useHistory()
    const loginVerifyCallBack = (res: any) => {
        console.log('callback:', res)
        // res（用户主动关闭验证码）= {ret: 2, ticket: null}
        // res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
        if (res.ret === 0) {
            // 蒙蔽接口反了
            login(res.ticket, res.randstr)
        }
    }

    const submit = () => {
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
        <div className="login-card flex-column-center m-b-60">
            <div className="login-title">登陆您的账号</div>
            <ChForm
                form={formRef}
                className="login-form"
                formData={[
                    {
                        type: FormItemType.input,
                        name: 'username',
                        label: '',
                        placeholder: '账号',
                        rules: [{ required: true, message: '账号不能为空' }],
                    },
                    {
                        type: FormItemType.password,
                        name: 'password',
                        label: '',
                        placeholder: '密码',
                        rules: [{ required: true, message: '密码不能为空' }],
                    },
                ]}
            />
            <Button onClick={submit} type="primary" className="login-button">
                登录
            </Button>
            <div className="flex-between m-t-10 m-b-30" style={{ width: '100%' }}>
                <div className="login-to-register">
                    没有账号？<a onClick={toRegister}>注册</a>
                </div>
                <div
                    onClick={() => {
                        history.push('/resetPassword')
                    }}
                    className="login-forget-password"
                >
                    <a>忘记密码？</a>
                </div>
            </div>
        </div>
    )
}

function Login() {
    return (
        <div className="login-page flex-column-all-center">
            <div className="login-header m-b-20"></div>
            <LoginPageStore.Provider>
                <LoginCard />
            </LoginPageStore.Provider>
        </div>
    )
}

export default Login
