import { Input, Button } from 'antd'
import { ChUtils } from 'ch-ui'
import React, { useState } from 'react'
import './index.less'
const { chHooks } = ChUtils

interface VerificationCodeInputProps {
    onGetCode?: () => Promise<Boolean> | void
    value?: string
    onChange?: (v: string) => void
}

function VerificationCodeInput(props: VerificationCodeInputProps): JSX.Element {
    const [buttonCount, setButtonCount] = useState(0)
    const [isCountDown, setIsCountDown] = useState<Boolean>(false)
    chHooks.useInterval(
        () => {
            if (buttonCount === 60) {
                setButtonCount(0)
                setIsCountDown(false)
                return
            }
            setButtonCount(buttonCount + 1)
        },
        isCountDown ? 1000 : null
    )

    const reciprocal = () => {
        if (isCountDown) return
        props.onGetCode &&
            props.onGetCode()?.then((res) => {
                if (res) {
                    setIsCountDown(true)
                }
            })
    }

    return (
        <div className="flex-center">
            <Input
                onChange={(e) => {
                    props.onChange && props.onChange(e.target.value)
                }}
                className="ch-verificationCode-input"
                placeholder="请输入验证码"
            />
            <Button onClick={reciprocal} type="link" block className="ch-verificationCode-button">
                {buttonCount ? `${61 - buttonCount}秒后重试` : '获取验证码'}
            </Button>
        </div>
    )
}

export default VerificationCodeInput
