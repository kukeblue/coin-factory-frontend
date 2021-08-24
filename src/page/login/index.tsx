import { Button } from 'antd'
import React from 'react'
import { ChForm, FormItemType } from 'ch-ui'
import { createContainer, useContainer } from 'unstated-next'
import './index.less'
import { useHistory } from 'react-router-dom'

function useLoginStore() {
    const history = useHistory()

    const login = () => {
        console.debug('debug: to do login')
    }
    const toRegister = () => {
        console.debug('debug: to do register')
        history.push('/register')
    }
    return {
        login,
        toRegister,
    }
}

const UserStore = createContainer(useLoginStore)

function LoginCard() {
    const { login, toRegister } = useContainer(UserStore)

    return (
        <div className="login-card flex-column-center m-b-60">
            <div className="login-title">登陆您的账号</div>
            <ChForm
                className="login-form"
                formData={[
                    {
                        type: FormItemType.input,
                        name: 'username',
                        label: '',
                        placeholder: '账号',
                    },
                    {
                        type: FormItemType.input,
                        inputtype: 'password',
                        name: 'password',
                        label: '',
                        placeholder: '密码',
                    },
                ]}
            />
            <Button id="TencentCaptcha" data-appid="2006315435" data-cbfn="callbackName" data-biz-state="data-biz-state" onClick={login} type="primary" className="login-button">
                登录
            </Button>
            <div className="flex-between m-t-10 m-b-30" style={{ width: '100%' }}>
                <div className="login-to-register">
                    没有账号？<a onClick={toRegister}>注册</a>
                </div>
                <div className="login-forget-password">
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
            <UserStore.Provider>
                <LoginCard />
            </UserStore.Provider>
        </div>
    )
}

export default Login
