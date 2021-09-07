import React, { useEffect, useState } from 'react'
import { Input, message } from 'antd'
import './index.less'
import { SyncOutlined } from '@ant-design/icons'

interface AjaxBuilderInputProps {
    ajaxGetValue: () => Promise<string>
    defaultValue?: string
    onChange?: (value: string) => void
}

export default function AjaxBuilderInput(props: AjaxBuilderInputProps) {
    const [showSpin, setShowSpin] = useState(false)
    const [value, setValue] = useState<string>()

    useEffect(() => {
        if (!value) return
        props.onChange && props.onChange(value)
    }, [value])

    const buildValue = () => {
        if (!showSpin) {
            setShowSpin(true)
            props
                .ajaxGetValue()
                .then((res) => {
                    setValue(res)
                })
                .catch((error) => {
                    message.error(error.message)
                })
                .finally(() => {
                    setShowSpin(false)
                })
        }
    }
    return (
        <div className="ajaxBuilderInput">
            <Input defaultValue={props.defaultValue} value={value} />
            <div className="ajaxBuilderInput-button flex-center">
                {showSpin && <SyncOutlined spin />}
                {!showSpin && <a onClick={buildValue}>生成</a>}
            </div>
        </div>
    )
}
