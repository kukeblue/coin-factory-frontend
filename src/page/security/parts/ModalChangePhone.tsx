import { useForm } from 'antd/lib/form/Form'
import { SecurityPageStore } from '../UseSecurityPageStore'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import { Alert, message, Modal } from 'antd'
import VerificationCodeInput from '../../../component/from/ChVerificationCodeInput'
import React from 'react'
import { GlobalStore } from '../../../store/globalStore'

export default function ModalChangePhone() {
    const [formRef] = useForm()
    const { setModalChangePhoneShow, modalChangePhoneShow } = SecurityPageStore.useContainer()
    const { fetchAuthCode, fetchUserInfo } = GlobalStore.useContainer()
    const onGetCode = async () => {
        const values = await formRef.validateFields(['mobile'])
        return fetchAuthCode('phone', 'auth_mobile', { mobile: values.mobile })
    }
    const onGetEmailCode = async () => {
        return fetchAuthCode('email', 'auth_mobile')
    }
    const submit = async () => {
        const values = await formRef.validateFields()
        ChUtils.Ajax.request({
            url: '/api/bind_mobile',
            data: values,
            method: 'post',
        }).then((res) => {
            if (res.code === 0) {
                setModalChangePhoneShow(false)
                fetchUserInfo()
                message.success('手机号绑定成功')
            }
        })
    }

    return (
        <Modal onOk={submit} visible={modalChangePhoneShow} okText="确定" cancelText="取消" className="modalChangePhone" onCancel={() => setModalChangePhoneShow(false)}>
            <div className="title-modal flex-center">绑定手机</div>
            <div className="m-t-20 m-b-20">
                <Alert className="modalChangePhone-alert" type="warning" showIcon message="为了您的资金安全，修改手机号24小时内不能提现"></Alert>
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
                                    return ChUtils.chValidator.validatePhone(value) ? Promise.resolve() : Promise.reject(new Error())
                                },
                            },
                        ],
                    },
                    {
                        type: FormItemType.other,
                        dom: <VerificationCodeInput onGetCode={onGetCode} />,
                        name: 'mobile_code',
                        label: '短信验证码',
                    },
                    {
                        type: FormItemType.other,
                        dom: <VerificationCodeInput onGetCode={onGetEmailCode} />,
                        name: 'email_code',
                        label: '邮箱验证码',
                    },
                ]}
            />
        </Modal>
    )
}
