import React from 'react'
import { Select, SelectProps } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import './index.less'

export default function PSelect(props: SelectProps<any>) {
    return (
        <div style={props.style} className="pSelect flex-row-center">
            <Select {...props}></Select>
            <CaretDownOutlined className="pSelect-icon" />
        </div>
    )
}
