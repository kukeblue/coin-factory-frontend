import React from 'react'
import { Select, SelectProps } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import './index.less'

export default function PSelect(props: SelectProps<any>) {
    return (
        <div style={props.style} className="pSelect flex-row-center">
            <Select {...props} placeholder="选择币种类型"></Select>
            <CaretDownOutlined className="pSelect-icon" />
        </div>
    )
}
