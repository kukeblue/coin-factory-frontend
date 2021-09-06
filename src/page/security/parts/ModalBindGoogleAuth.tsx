import { GlobalStore } from '../../../store/globalStore'
import { SecurityPageStore } from '../UseSecurityPageStore'
import React, { useEffect, useState } from 'react'
import { useForm } from 'antd/lib/form/Form'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import { message, Modal, Steps } from 'antd'
import QRCode from 'qrcode.react'
import ChVerificationCodeInput from '../../../component/from/ChVerificationCodeInput'
const { Step } = Steps

export default function ModalBindGoogleAuth() {
    const { fetchAuthCode, fetchUserInfo } = GlobalStore.useContainer()
    const { modalBindGoogleAuthShow, setModalBindGoogleAuthShow } = SecurityPageStore.useContainer()
    const [qrSecret, setQrSecret] = useState<string>('')
    const [formRef] = useForm()
    useEffect(() => {
        if (modalBindGoogleAuthShow) {
            ChUtils.Ajax.request({ url: '/api/get_google_auth', data: {}, method: 'post' }).then((res) => {
                if (res.data) {
                    setQrSecret(res.data)
                }
            })
        }
    }, [modalBindGoogleAuthShow])
    const submit = () => {
        setModalBindGoogleAuthShow(false)
        formRef.validateFields().then((values) => {
            ChUtils.Ajax.request({
                url: '/api/bind_google_auth',
                data: {
                    secret: qrSecret,
                    ...values,
                },
                method: 'post',
            }).then((res) => {
                if (res.cdoe == 0) {
                    setModalBindGoogleAuthShow(false)
                    fetchUserInfo()
                    message.success('绑定成功')
                } else {
                    message.error(res.msg)
                }
            })
        })
    }
    const onGetCode = (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            resolve(false)
        })
    }
    const step1 = (
        <div className="flex-row-center m-t-10">
            <div className="flex-column-center">
                <div className="security-qrcode">
                    <QRCode
                        id="qrCode"
                        value="https://ch-ui.kukechen.top/"
                        size={120} // 二维码的大小
                        fgColor="#000000" // 二维码的颜色
                        style={{ margin: 'auto' }}
                    />
                </div>
                <div className="m-t-10">IOS</div>
            </div>
            <div className="flex-column-center m-l-50">
                <div className="security-qrcode">
                    <div className="security-qrcode">
                        <QRCode
                            id="qrCode"
                            value="https://ch-ui.kukechen.top/"
                            size={120} // 二维码的大小
                            fgColor="#000000" // 二维码的颜色
                            style={{ margin: 'auto' }}
                        />
                    </div>
                </div>
                <div className="m-t-10">Android</div>
            </div>
        </div>
    )
    const step2 = (
        <div>
            <div className="text-modal-tip">请务必妥善保管谷歌验证密钥，以免更换或丢失手机导致无法换绑</div>
            <div className="security-qrcode m-t-10">
                <QRCode
                    id="qrCode"
                    value={qrSecret}
                    size={120} // 二维码的大小
                    fgColor="#000000" // 二维码的颜色
                    style={{ margin: 'auto' }}
                />
            </div>
            <div className="m-t-10">密钥: {qrSecret}</div>
        </div>
    )

    const step3 = (
        <div className="security-modalBindGoogleAuth-step3 m-t-20">
            {
                <ChForm
                    form={formRef}
                    formData={[
                        {
                            label: '短信验证码',
                            name: 'mobile',
                            type: FormItemType.other,
                            dom: <ChVerificationCodeInput onGetCode={() => fetchAuthCode('phone', 'bindgoogle')} />,
                            rules: [{ required: true, message: '请输入短信验证码' }],
                        },
                        {
                            label: '邮箱验证码',
                            name: 'email',
                            type: FormItemType.other,
                            dom: <ChVerificationCodeInput onGetCode={() => fetchAuthCode('email', 'bindgoogle')} />,
                            rules: [{ required: true, message: '请输入邮箱验证码' }],
                        },
                        {
                            label: '谷歌验证码',
                            name: 'google_code',
                            type: FormItemType.input,
                            rules: [{ required: true, message: '请输入谷歌验证码' }],
                            placeholder: '请输入谷歌验证码',
                        },
                    ]}
                ></ChForm>
            }
        </div>
    )

    return (
        <Modal
            destroyOnClose
            width={750}
            visible={modalBindGoogleAuthShow}
            okText="确定"
            cancelText="取消"
            className="modalChangePhone"
            onCancel={() => {
                setModalBindGoogleAuthShow(false)
            }}
            onOk={submit}
        >
            <div className="title-modal flex-center m-b-50">绑定谷歌验证器</div>
            <Steps progressDot direction="vertical" current={2}>
                <Step title='扫码下载或者在应用商店搜索"Google Authentication"应用' description={step1} />
                <Step title="安装完成后打开Google Authentication，扫描下方二维码或手动输入密钥，得到6位验证码" description={step2} />
                <Step title="请将您获得的验证码填入下方输入框中，并完成验证" description={step3} />
            </Steps>
        </Modal>
    )
}
