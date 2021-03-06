import React, { useState } from 'react'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import DropRangePicker from '../../../component/from/DropRangePicker'
import { Button, Menu, message, Modal, Table } from 'antd'
import { CaretDownOutlined, CaretUpOutlined, CopyOutlined } from '@ant-design/icons'
import PSelect from '../../../component/from/PSelect'
import { useForm } from 'antd/lib/form/Form'
import { useOptionFormListHook2, usePage } from '../../../utils/chHooks'
import { AjAxPageCommonSetting } from '../../../config/constants'
import { GlobalStore } from '../../../store/globalStore'
import { IAddress } from '../interface'
import { ColumnsType } from 'antd/lib/table/interface'
import Authenticator from '../../../component/auth/Authenticator'
import { CopyToClipboard } from 'react-copy-to-clipboard'

function Address() {
    const { currentApp } = GlobalStore.useContainer()
    const { options } = useOptionFormListHook2({
        url: '/api/get_open_coins',
        query: { appid: currentApp!.id },
        labelKey: 'symbol',
        onAjaxAfter: (res) => {
            return { status: res.code, list: res.data }
        },
    })
    const [formRef] = useForm()
    const search = () => {
        formRef.validateFields().then((res) => {
            if (res.dateRange && res.dateRange.length > 1) {
                res.start_at = res.dateRange[0].format('YY-MM-DD hh:mm:ss')
                res.end_at = res.dateRange[1].format('YY-MM-DD hh:mm:ss')
            }
            delete res.dateRange
            ChUtils.chFormats.deleteObjectEmptyKey(res)
            reload(undefined, res)
        })
    }
    const [spread, setSpread] = useState<boolean>(false)
    const { reload, list, total, status } = usePage<IAddress>({
        url: '/api/get_addr_list',
        pageSize: 10,
        query: {},
        onAjaxBefore: AjAxPageCommonSetting.buildOnAjaxBefore({ appid: currentApp!.id }),
        onAjaxAfter: AjAxPageCommonSetting.onAjaxAfter,
        isInitFetch: true,
    })
    const columns: ColumnsType<IAddress> = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: '??????', dataIndex: 'symbol', key: 'symbol' },
        {
            title: '??????',
            dataIndex: 'addr',
            key: 'addr',
            render: (addr: string) => {
                return (
                    <div className="flex-center">
                        <div className="m-r-5">{addr}</div>
                        <CopyToClipboard
                            text={addr || ''}
                            onCopy={() => {
                                message.success('????????????')
                            }}
                        >
                            <CopyOutlined />
                        </CopyToClipboard>
                    </div>
                )
            },
        },
        {
            title: '??????',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (created_at: string) => {
                return ChUtils.chFormats.formatDate(Number(created_at) * 1000)
            },
        },
        {
            title: '??????',
            dataIndex: 'options',
            key: 'option',
            render: (_: any, item: IAddress) => {
                return (
                    <Authenticator
                        callback={() => {
                            ChUtils.Ajax.request({
                                url: '/api/get_addr_pri',
                                data: {
                                    id: item.id,
                                    appid: currentApp?.id,
                                },
                            }).then((res) => {
                                if (res.code === 0) {
                                    Modal.success({
                                        title: '????????????',
                                        content: <div>{res.data}</div>,
                                    })
                                }
                            })
                        }}
                    >
                        <a> ????????????</a>
                    </Authenticator>
                )
            },
        },
    ]
    return (
        <div className="capital-content">
            <div className="capital-content-header">
                <Menu selectedKeys={['1']} mode="horizontal">
                    <Menu.Item key="1">????????????</Menu.Item>
                </Menu>
            </div>
            <div className="p-l-40 p-r-40">
                <div className={spread ? 'search-bar_spread' : 'search-bar'}>
                    <ChForm
                        form={formRef}
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
                                name: 'submitButton',
                                label: '',
                                dom: (
                                    <div className="flex-center">
                                        <Button className="m-r-20" onClick={search}>
                                            ??????
                                        </Button>
                                        <div
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setSpread(!spread)
                                            }}
                                        >
                                            ???????????? {spread ? <CaretUpOutlined /> : <CaretDownOutlined />}
                                        </div>
                                    </div>
                                ),
                                layout: {
                                    span: 6,
                                },
                            },
                            {
                                type: FormItemType.other,
                                name: 'symbol',
                                label: '',
                                dom: <PSelect className="m-r-10" options={options} style={{ width: 130 }} showArrow={false} placeholder="??????????????????" />,
                                layout: {
                                    span: 4,
                                },
                            },
                            {
                                type: FormItemType.other,
                                name: 'searchType',
                                label: '',
                                dom: (
                                    <PSelect
                                        options={[
                                            {
                                                label: '??????',
                                                value: 1,
                                            },
                                        ]}
                                        className="m-r-10"
                                        style={{ width: 130 }}
                                        showArrow={false}
                                        placeholder="??????????????????"
                                    />
                                ),
                                layout: {
                                    span: 4,
                                },
                            },
                            {
                                type: FormItemType.input,
                                name: 'search',
                                label: '',
                                placeholder: '?????????????????????',
                                layout: {
                                    span: 5,
                                },
                            },
                        ]}
                    />
                </div>
                <Table
                    pagination={{
                        total: total,
                        pageSize: 10,
                        defaultCurrent: 1,
                        onChange: (page) => {
                            reload(page)
                        },
                    }}
                    dataSource={list}
                    columns={columns}
                />
            </div>
        </div>
    )
}

export default () => <Address />
