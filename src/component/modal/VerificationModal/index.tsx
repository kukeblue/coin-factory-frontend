import React from 'react'
import { Modal } from 'antd'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import ChVerificationCodeInput from '../../from/ChVerificationCodeInput'
function VerificationModal() {
    const onGetPhoneCode = (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            resolve(true)
        })
    }
    return (
        <Modal visible={true}>
            <div className="title-modal flex-center m-b-50">安全验证</div>
            <ChForm
                layout={{
                    labelCol: { span: 4 },
                    wrapperCol: { offset: 1, span: 14 },
                }}
                formData={[
                    {
                        label: '您的手机号',
                        name: 'phone',
                        type: FormItemType.other,
                        dom: <div>{ChUtils.chFormats.phoneNumberHideMiddle('18370893382')}</div>,
                    },
                    {
                        label: '短信验证码',
                        name: 'phoneCode',
                        type: FormItemType.other,
                        dom: <ChVerificationCodeInput onGetCode={onGetPhoneCode} />,
                    },
                    {
                        label: '您的邮箱',
                        name: 'email',
                        type: FormItemType.other,
                        dom: <div>{ChUtils.chFormats.emailHideMiddle('kukechenhuan@outlook.com')}</div>,
                    },
                ]}
            />
        </Modal>
    )
}

export default VerificationModal
