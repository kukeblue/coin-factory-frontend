import React, { useEffect } from 'react'
import { Input, message, Modal, Table } from 'antd'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import ChVerificationCodeInput from '../../from/ChVerificationCodeInput'
import { GlobalStore } from '../../../store/globalStore'
import { useForm } from 'antd/lib/form/Form'
import { FormDataItem } from 'ch-ui/dist/component/ChForm'
import { IAuthParams, VerificationCodeType } from '../../../typings'
import { useHistory } from 'react-router-dom'

interface VerificationModalResult {
    phoneCode: string
    emailCode: string
    googleCode: string
}

interface VerificationModalProps {
    onSubmit?: (v: IAuthParams) => void
    verificationFields?: VerificationCodeType[]
    visible?: boolean
    onCancel?: () => void
}

const defaultVerificationModalProps: VerificationModalProps = {
    verificationFields: ['phone', 'email', 'google'],
}

function VerificationModal(props: VerificationModalProps) {
    const verificationFields = props.verificationFields || defaultVerificationModalProps.verificationFields
    const [formRef] = useForm()
    const { userInfo, fetchAuthCode } = GlobalStore.useContainer()
    const history = useHistory()
    const onGetCode = (v: VerificationCodeType): Promise<Boolean> => {
        console.log('debug: 获取验证码: v')
        return fetchAuthCode(v, 'operation')
    }

    const toSecurityPage = () => {
        history.push('/security')
    }

    let formData: FormDataItem[] = []
    if (verificationFields?.includes('phone')) {
        formData = formData.concat([
            {
                label: '您的手机号',
                name: 'phone',
                type: FormItemType.other,
                dom: userInfo?.mobile_auth ? (
                    <div>{ChUtils.chFormats.phoneNumberHideMiddle(userInfo.mobile!)}</div>
                ) : (
                    <a onClick={toSecurityPage} className="text-link">
                        去绑定
                    </a>
                ),
            },
            {
                label: '短信验证码',
                name: 'phoneCode',
                type: FormItemType.other,
                dom: <ChVerificationCodeInput onGetCode={() => onGetCode('phone')} />,
                rules: [{ required: true, message: '请输入短信验证码' }],
            },
        ])
    }
    if (verificationFields?.includes('email')) {
        formData = formData.concat([
            {
                label: '您的邮箱',
                name: 'email',
                type: FormItemType.other,
                dom: userInfo?.email_auth ? (
                    <div>{ChUtils.chFormats.emailHideMiddle(userInfo.email!)}</div>
                ) : (
                    <a onClick={toSecurityPage} className="text-link">
                        去绑定
                    </a>
                ),
            },
            {
                label: '邮箱验证码',
                name: 'emailCode',
                type: FormItemType.other,
                dom: <ChVerificationCodeInput onGetCode={() => onGetCode('email')} />,
                rules: [{ required: true, message: '请输入邮箱验证码' }],
            },
        ])
    }
    if (verificationFields?.includes('google')) {
        formData.push({
            label: '谷歌验证码',
            name: 'googleCode',
            type: FormItemType.other,
            dom: userInfo.google_auth ? (
                <Input placeholder="请输入谷歌验证码" />
            ) : (
                <a onClick={toSecurityPage} className="text-link">
                    去绑定
                </a>
            ),
            rules: [{ required: true, message: '请输入谷歌验证码' }],
        })
    }
    return (
        <Modal
            destroyOnClose={true}
            onOk={() => {
                if (userInfo.mobile_auth && userInfo.mobile_auth && userInfo.google_auth) {
                    formRef.validateFields().then((values) => {
                        ChUtils.chFormats.deleteObjectEmptyKey(values)
                        props.onSubmit &&
                            props.onSubmit({
                                email: values.emailCode,
                                mobile: values.phoneCode,
                                google: values.googleCode,
                            })
                    })
                }
            }}
            visible={props.visible}
            onCancel={() => props.onCancel && props.onCancel()}
        >
            <div className="title-modal flex-center m-b-50">安全验证</div>
            <ChForm
                form={formRef}
                layout={{
                    labelCol: { span: 5 },
                    wrapperCol: { offset: 1, span: 14 },
                }}
                formData={formData}
            />
        </Modal>
    )
}

export default VerificationModal
