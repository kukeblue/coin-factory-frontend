import React, { useState } from 'react'
import VerificationModal from '../../modal/VerificationModal'
import { ChUtils } from 'ch-ui'
import { IAuthParams } from '../../../typings'

interface AuthenticatorProps {
    children: JSX.Element
    callback: (v?: IAuthParams) => void
}

export default function Authenticator(props: AuthenticatorProps) {
    const [verificationModalShow, setVerificationModalShow] = useState(false)
    const authPermission = () => {
        ChUtils.Ajax.request({
            url: '/api/is_authority',
            data: {},
            method: 'post',
        }).then((res) => {
            if (res.data === 1) {
                props.callback()
            } else {
                setVerificationModalShow(true)
            }
        })
    }

    const submitAuth = (authParams: IAuthParams) => {
        ChUtils.Ajax.request({
            url: '/api/check_auth',
            data: authParams,
            method: 'post',
        }).then((res) => {
            if (res.code === 0) {
                setVerificationModalShow(false)
                props.callback()
            }
        })
    }

    return (
        <>
            <VerificationModal
                onSubmit={(values) => {
                    submitAuth(values)
                }}
                onCancel={() => setVerificationModalShow(false)}
                visible={verificationModalShow}
            />
            <div onClick={authPermission}>{props.children}</div>
        </>
    )
}
