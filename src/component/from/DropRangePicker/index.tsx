import React from 'react'
import { DatePicker } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import './index.less'
import { Moment } from 'moment'
import { EventValue } from 'rc-picker/lib/interface'
const { RangePicker } = DatePicker
export declare type RangeValue<T> = [EventValue<T>, EventValue<T>] | null | undefined
interface DropRangePickerProps {
    onChange?: () => void
    value?: RangeValue<Moment>
}
export default function DropRangePicker(props: DropRangePickerProps) {
    return (
        <div className="dropRangePicker flex-row-center">
            <div className="dropRangePicker-label flex-center">
                <span className="m-l-10 m-r-10">搜索时间范围</span>
                <CaretDownOutlined />
            </div>
            <div>
                <RangePicker
                    onChange={props.onChange}
                    value={props.value}
                    format="YYYY-MM-DD HH:mm"
                    showTime={{
                        showSecond: false,
                    }}
                />
            </div>
        </div>
    )
}
