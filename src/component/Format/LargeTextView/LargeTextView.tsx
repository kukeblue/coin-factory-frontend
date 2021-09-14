import React from 'react'
import { Tooltip } from 'antd'
import './index.less'
export default function LargeTextView({ text, disableTooltip }: { text: string; disableTooltip?: boolean }) {
    return disableTooltip ? (
        <div className="large-text">{text}</div>
    ) : (
        <Tooltip placement="topLeft" title={text}>
            <div className="large-text">{text}</div>
        </Tooltip>
    )
}
