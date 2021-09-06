import React from 'react'
import { DatePicker } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import './index.less'
const { RangePicker } = DatePicker
export default function DropRangePicker() {
    return (
        <div className="dropRangePicker flex-row-center">
            <div className="dropRangePicker-label flex-center" onClick={() => {}}>
                <span className="m-l-10 m-r-10">搜索时间范围</span>
                <CaretDownOutlined />
            </div>
            <div>
                <RangePicker
                    format="YYYY-MM-DD HH:mm"
                    showTime={{
                        showSecond: false,
                    }}
                />
            </div>
        </div>
    )
}
