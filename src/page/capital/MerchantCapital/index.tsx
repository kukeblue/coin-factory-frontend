import { GlobalStore } from '../../../store/globalStore'
import { usePage } from '../../../utils/chHooks'
import { ICallBackUrlSetting } from '../../applicationCenter/interface'
import { AjAxPageCommonSetting } from '../../../config/constants'
import { Button, Menu, Table } from 'antd'
import { ChForm, FormItemType } from 'ch-ui'
import DropRangePicker from '../../../component/from/DropRangePicker'
import PSelect from '../../../component/from/PSelect'
import React from 'react'

export default function MerchantCapital() {
    const { currentApp } = GlobalStore.useContainer()
    const { list, total, reload, status } = usePage<ICallBackUrlSetting>({
        url: '/api/get_zr_list',
        pageSize: 10,
        query: {},
        onAjaxBefore: AjAxPageCommonSetting.buildOnAjaxBefore({ appid: currentApp.id }),
        onAjaxAfter: AjAxPageCommonSetting.onAjaxAfter,
        isInitFetch: true,
    })

    return (
        <div className="capital-content">
            <div className="capital-content-header">
                <Menu defaultSelectedKeys={['1']} mode="horizontal">
                    <Menu.Item key="1">充值记录</Menu.Item>
                    <Menu.Item key="2">提币记录</Menu.Item>
                </Menu>
            </div>
            <div className="capital-search">
                <ChForm
                    formData={[
                        {
                            type: FormItemType.other,
                            name: 'dateRange',
                            label: '',
                            dom: <DropRangePicker />,
                            layout: {
                                span: 15,
                            },
                        },
                        {
                            type: FormItemType.other,
                            name: '2',
                            label: '',
                            dom: (
                                <PSelect
                                    options={[
                                        {
                                            label: 'GET',
                                            value: 1,
                                        },
                                        {
                                            label: 'POST',
                                            value: 2,
                                        },
                                        {
                                            label: '请求地址',
                                            value: 3,
                                        },
                                    ]}
                                    style={{ width: 130 }}
                                    showArrow={false}
                                    placeholder="选择查找类型"
                                />
                            ),
                            layout: {
                                span: 5,
                                offset: 1,
                            },
                        },
                        {
                            type: FormItemType.input,
                            name: '3',
                            label: '',
                            placeholder: '请输入查找内容',
                            layout: {
                                span: 5,
                            },
                        },
                        {
                            type: FormItemType.other,
                            name: '4',
                            label: '',
                            dom: (
                                <Button
                                    onClick={() => {
                                        reload()
                                    }}
                                    className="m-l-10"
                                >
                                    搜索
                                </Button>
                            ),
                            layout: {
                                span: 5,
                            },
                        },
                    ]}
                />
            </div>
            <div className="p-l-30 p-r-30">
                <Table dataSource={[]} columns={[]}></Table>
            </div>
        </div>
    )
}
