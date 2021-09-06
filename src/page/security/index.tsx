import { Alert, message, Modal, Radio, Steps } from 'antd'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import React, { useEffect, useRef, useState } from 'react'
import { createContainer } from 'unstated-next'
import QRCode from 'qrcode.react'
import './index.less'
import constants from '../../config/constants'
import { LoginLog } from './interface'
import { IUserInfo } from '../../typings'
import VerificationCodeInput from '../../component/from/ChVerificationCodeInput'
import { useForm } from 'antd/lib/form/Form'
import ChVerificationCodeInput from '../../component/from/ChVerificationCodeInput'
import { GlobalStore } from '../../store/globalStore'
import { UseSecurityPageStore, SecurityPageStore } from './UseSecurityPageStore'
import Header from './parts/Header'
import SecurityCertificateStatus from './parts/SecurityCertificateStatus'
import CertificateList from './parts/CertificateList'
import LoginRecords from './parts/LoginRecords'
import ModalChangePhone from './parts/ModalChangePhone'
import ModalBindGoogleAuth from './parts/ModalBindGoogleAuth'
import ModalChangeEmail from './parts/ModalChangeEmail'
import ModalChangePassword from './parts/ModalChangePassword'
import ModalChangePaymentCode from './parts/ModalChangePaymentCode'
const { Step } = Steps

function SecurityPage() {
    return (
        <div className="security-page">
            <div className="p-t-10 p-b-10">
                <Alert message={constants.rechargeTip} type="warning" showIcon closable />
            </div>
            <div className="security-content">
                <Header />
                <SecurityCertificateStatus />
                <CertificateList />
                <LoginRecords />
                <ModalChangePhone />
                <ModalBindGoogleAuth />
                <ModalChangeEmail />
                <ModalChangePassword />
                <ModalChangePaymentCode />
            </div>
        </div>
    )
}

export default () => (
    <SecurityPageStore.Provider>
        <SecurityPage />
    </SecurityPageStore.Provider>
)
