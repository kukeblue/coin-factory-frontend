import { useForm } from 'antd/lib/form/Form'
import { SecurityPageStore } from '../UseSecurityPageStore'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import { Alert, message, Modal } from 'antd'
import VerificationCodeInput from '../../../component/from/ChVerificationCodeInput'
import React from 'react'
import { GlobalStore } from '../../../store/globalStore'

export default function ModalChangePaymentCode() {
    const [formRef] = useForm()
    const { setModalChangePaymentCodeShow, modalChangePaymentCodeShow } = SecurityPageStore.useContainer()
    const { fetchAuthCode, fetchUserInfo } = GlobalStore.useContainer()
    const onGetEmailCode = async () => {
        return fetchAuthCode('email', 'uppaywd')
    }
    const submit = async () => {
        const values = await formRef.validateFields()
        ChUtils.Ajax.request({
            url: '/api/upaywd',
            data: values,
            method: 'post',
        }).then((res) => {
            if (res.code === 0) {
                setModalChangePaymentCodeShow(false)
                fetchUserInfo()
                message.success('密码修改成功')
            }
        })
    }

    return (
        <Modal onOk={submit} visible={modalChangePaymentCodeShow} okText="确定" cancelText="取消" className="ModalChangePaymentCode" onCancel={() => setModalChangePaymentCodeShow(false)}>
            <div className="title-modal flex-center">修改操作密码</div>
            <ChForm
                form={formRef}
                formData={[
                    {
                        type: FormItemType.password,
                        name: 'paywd',
                        label: '新操作密码',
                        placeholder: '请输入新操作密码',
                        rules: [
                            {
                                required: true,
                                message: '请输入新操作密码!',
                            },
                        ],
                    },
                    {
                        type: FormItemType.password,
                        name: 'towpaywd',
                        label: '重复新操作密码',
                        placeholder: '请重复新操作密码',
                        rules: [
                            {
                                required: true,
                                message: '请重复新操作密码！',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('paywd') === value) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(new Error('两次输入的密码不匹配'))
                                },
                            }),
                        ],
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
