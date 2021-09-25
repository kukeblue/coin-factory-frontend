import React, { useEffect, useState } from 'react'
import { Button, Input, Menu, Modal, Table } from 'antd'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import PSelect from '../../../component/from/PSelect'
import { useOptionFormListHook2, usePage } from '../../../utils/chHooks'
import { GlobalStore } from '../../../store/globalStore'
import TextArea from 'antd/lib/input/TextArea'
import { useForm } from 'antd/lib/form/Form'
import { createContainer } from 'unstated-next'
import { ICallBackLog, IProtectSetting, IRequestLog } from '../interface'
import { AjAxPageCommonSetting } from '../../../config/constants'
import { ColumnsType } from 'antd/lib/table/interface'

function usePageStore() {
    const [modalEditProtectionSetting, setModalEditProtectionSetting] = useState(false)
    return {
        modalEditProtectionSetting,
        setModalEditProtectionSetting,
    }
}

const PageStore = createContainer(usePageStore)

function ThresholdLevelInput({ onChange, value }: { onChange?: (value: (number | undefined)[]) => void; value?: (number | undefined)[] }) {
    const onItemChange = (v: number, index: number) => {
        const newValue: (number | undefined)[] = value || [undefined, undefined]
        newValue[index] = Number(v.toFixed(2))
        onChange && onChange(newValue.slice())
    }

    return (
        <div className="flex-center">
            <Input onChange={(e) => onItemChange(Number(e.target.value), 0)} value={value ? value[0] : undefined} type="number" width={50} placeholder="上限" />
            <Input onChange={(e) => onItemChange(Number(e.target.value), 1)} value={value ? value[1] : undefined} type="number" className="m-l-20" width={50} placeholder="下限" />
        </div>
    )
}

function ModalEditor() {
    const { setModalEditProtectionSetting, modalEditProtectionSetting } = PageStore.useContainer()
    const [formRef] = useForm()
    const { currentApp } = GlobalStore.useContainer()
    const { options } = useOptionFormListHook2({
        url: '/api/get_open_coins',
        query: { appid: currentApp!.id },
        labelKey: 'symbol',
        valueKey: 'symbol',
        onAjaxAfter: (res) => {
            return { status: res.code, list: res.data }
        },
    })

    useEffect(() => {
        if (options && options.length > 0) {
            formRef.setFieldsValue({
                symbol: options[0].value,
            })
        }
    }, [options])

    const submit = () => {
        formRef.validateFields().then((v) => {
            if (v.thresholdLevel) {
                v.lower = v.thresholdLevel[0]
                v.upper = v.thresholdLevel[1]
                delete v.thresholdLevel
            }
            v.appid = currentApp?.id
            ChUtils.Ajax.request({
                url: '/api/add_monitor',
                data: v,
            }).then((res) => {
                if (res.code === 0) {
                    setModalEditProtectionSetting(false)
                }
            })
        })
    }

    return (
        <Modal onOk={submit} onCancel={() => setModalEditProtectionSetting(false)} visible={modalEditProtectionSetting} title="添加">
            <ChForm
                form={formRef}
                layout={{
                    labelCol: { span: 5 },
                    wrapperCol: { offset: 1, span: 14 },
                }}
                formData={[
                    {
                        rules: [{ required: true, message: '请选择币种' }],
                        label: '币种',
                        name: 'symbol',
                        type: FormItemType.other,
                        dom: <PSelect options={options} style={{ width: 130 }} showArrow={false} placeholder="选择币种类型" />,
                    },
                    {
                        label: '阀值',
                        name: 'thresholdLevel',
                        type: FormItemType.other,
                        dom: <ThresholdLevelInput />,
                    },
                    {
                        label: '报警方式',
                        name: 'remind_type',
                        type: FormItemType.radioGroup,
                        initialValue: 1,
                        options: [
                            {
                                label: '邮箱',
                                value: 1,
                            },
                            {
                                label: '手机',
                                value: 2,
                            },
                        ],
                    },
                    {
                        rules: [{ required: true, message: '输入监控地址' }],
                        label: '监控地址',
                        name: 'ips',
                        type: FormItemType.other,
                        dom: <TextArea rows={4} />,
                    },
                ]}
            />
        </Modal>
    )
}

function ProtectionTable() {
    const { currentApp } = GlobalStore.useContainer()
    const { setModalEditProtectionSetting } = PageStore.useContainer()
    const { reload, list, total, status } = usePage<IProtectSetting>({
        url: '/api/get_monitor_list',
        pageSize: 10,
        query: {},
        onAjaxBefore: AjAxPageCommonSetting.buildOnAjaxBefore({ appid: currentApp!.id }),
        onAjaxAfter: AjAxPageCommonSetting.onAjaxAfter,
        isInitFetch: true,
    })
    const columns: ColumnsType<IProtectSetting> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '币种',
            dataIndex: 'symbol',
            key: 'symbol',
        },
        {
            title: '阀值',
            dataIndex: 'upper_limit',
            key: 'upper_limit',
            render: (upper_limit, item) => {
                return (
                    <div className="flex-row-center">
                        <div className="m-r-5">{Number(item.lower_limit).toFixed(2)}</div>
                        {` ~ `}
                        <div className="m-l-5">{Number(item.upper_limit).toFixed(2)}</div>
                    </div>
                )
            },
        },
        {
            title: '报警方式',
            dataIndex: 'remind_type',
            key: 'remind_type',
            render: (remind_type) => {
                return remind_type == 0 ? '邮箱' : '手机'
            },
        },
        {
            title: '监控IP',
            dataIndex: 'ips',
            key: 'ips',
        },
        {
            title: '操作',
            dataIndex: '6',
            key: '6',
        },
    ]
    return (
        <div className="p-l-40 p-r-40">
            <div className="m-t-20 m-b-20 button-add-1">
                <Button
                    onClick={() => {
                        setModalEditProtectionSetting(true)
                    }}
                    style={{ width: 80 }}
                    type="primary"
                >
                    添加
                </Button>
            </div>
            <Table
                rowKey="id"
                loading={status === 'loading'}
                dataSource={list}
                columns={columns}
                pagination={{
                    total: total,
                    pageSize: 10,
                    defaultCurrent: 1,
                    onChange: (page) => {
                        reload(page)
                    },
                }}
            />
        </div>
    )
}

function Header() {
    return (
        <div className="applicationCenter-common-header">
            <div style={{ width: '100%' }}>
                <Menu defaultSelectedKeys={['1']} mode="horizontal">
                    <Menu.Item key="1">防护设置</Menu.Item>
                </Menu>
            </div>
        </div>
    )
}

function ProtectionSetting() {
    return (
        <div className="applicationCenter-protectionSetting">
            <Header></Header>
            <ProtectionTable />
            <ModalEditor />
        </div>
    )
}

export default () => (
    <PageStore.Provider>
        <ProtectionSetting />
    </PageStore.Provider>
)
