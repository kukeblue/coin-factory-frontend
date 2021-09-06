import { useForm } from 'antd/lib/form/Form'
import { SecurityPageStore } from '../UseSecurityPageStore'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import { Alert, message, Modal } from 'antd'
import VerificationCodeInput from '../../../component/from/ChVerificationCodeInput'
import React from 'react'
import { GlobalStore } from '../../../store/globalStore'

export default function ModalChangeEmail() {
    const [formRef] = useForm()
    const { setModalChangeEmailShow, modalChangeEmailShow } = SecurityPageStore.useContainer()
    const { fetchAuthCode, fetchUserInfo } = GlobalStore.useContainer()
    const onGetCode = async () => {
        return fetchAuthCode('phone', 'auth_email')
    }
    const onGetEmailCode = async () => {
        const values = await formRef.validateFields(['email'])
        return fetchAuthCode('email', 'auth_email', { email: values.email })
    }
    const submit = async () => {
        const values = await formRef.validateFields()
        ChUtils.Ajax.request({
            url: '/api/bind_email',
            data: values,
            method: 'post',
        }).then((res) => {
            if (res.code === 0) {
                setModalChangeEmailShow(false)
                fetchUserInfo()
                message.success('邮箱绑定成功')
            }
        })
    }

    return (
        <Modal onOk={submit} visible={modalChangeEmailShow} okText="确定" cancelText="取消" className="modalChangePhone" onCancel={() => setModalChangeEmailShow(false)}>
            <div className="title-modal flex-center">绑定邮箱</div>
            <ChForm
                form={formRef}
                formData={[
                    {
                        type: FormItemType.input,
                        name: 'email',
                        label: '新邮箱号',
                        placeholder: '请输入新邮箱',
                        rules: [
                            {
                                required: true,
                                message: '请输入新邮箱!',
                            },
                            {
                                type: 'email',
                            },
                        ],
                    },
                    {
                        type: FormItemType.other,
                        dom: <VerificationCodeInput onGetCode={onGetEmailCode} />,
                        name: 'email_code',
                        label: '邮箱验证码',
                    },
                    {
                        type: FormItemType.other,
                        dom: <VerificationCodeInput onGetCode={onGetCode} />,
                        name: 'mobile_code',
                        label: '手机验证码',
                    },
                ]}
            />
        </Modal>
    )
}
