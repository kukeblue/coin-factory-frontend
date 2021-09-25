import React, { useEffect, useState } from 'react'
import { Button, Menu, Table, Modal, Typography, Divider, notification, Popconfirm } from 'antd'
import { usePage } from '../../../utils/chHooks'
import { IWordOrder, IWorkOrderDetail, MWorkOrderStatusMap } from '../interface'
import { AjAxPageCommonSetting } from '../../../config/constants'
import { GlobalStore } from '../../../store/globalStore'
import { createContainer } from 'unstated-next'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import { useForm } from 'antd/lib/form/Form'
import { ColumnsType } from 'antd/lib/table/interface'
import { useHistory } from 'react-router-dom'
import QuillEditor from '../../../component/from/QuillEditor'
const { Title, Paragraph } = Typography

function usePageStore() {
    const [pageTab, setPageTab] = useState<string>('1')
    const [workOrderEditor, setWorkOrderEditor] = useState<IWorkOrderDetail>()
    const [modalWorkDetailShow, setModalWorkDetailShow] = useState<boolean>(false)

    return {
        pageTab,
        setPageTab,
        workOrderEditor,
        setWorkOrderEditor,
        modalWorkDetailShow,
        setModalWorkDetailShow,
    }
}

const PageStore = createContainer(usePageStore)

function ModalWordDetail() {
    const { modalWorkDetailShow, workOrderEditor, setModalWorkDetailShow } = PageStore.useContainer()
    return (
        <Modal footer={false} onCancel={() => setModalWorkDetailShow(false)} width={800} title="工单详情" visible={modalWorkDetailShow}>
            <Typography>
                <Title level={2}>{workOrderEditor?.Title}</Title>
                <Paragraph>
                    <pre>
                        <div style={{ minHeight: '300px' }} dangerouslySetInnerHTML={{ __html: workOrderEditor ? workOrderEditor.Contents : '' }}></div>
                    </pre>
                </Paragraph>
            </Typography>
        </Modal>
    )
}

function WorkOrderForm() {
    const { setPageTab } = PageStore.useContainer()

    const [formRef] = useForm()
    const submit = () => {
        formRef.validateFields().then((values) => {
            ChUtils.Ajax.request({
                url: '/api/add_gongdan',
                data: {
                    title: values.title,
                    contents: values.content,
                },
            }).then((res) => {
                if (res.code === 0) {
                    notification.success({ message: '工单提交成功' })
                    setPageTab('1')
                }
            })
        })
    }

    return (
        <div className="p-l-40 p-r-40 p-t-40">
            <ChForm
                form={formRef}
                formData={[
                    {
                        label: '标题',
                        type: FormItemType.input,
                        name: 'title',
                        placeholder: '请输入标题',
                        rules: [{ required: true, message: '请输入标题' }],
                    },
                    {
                        label: '工单内容',
                        type: FormItemType.other,
                        name: 'content',
                        placeholder: '请输入标题',
                        dom: <QuillEditor style={{ height: '300px' }} />,
                        rules: [{ required: true, message: '请输入工单内容' }],
                    },
                    {
                        label: '',
                        type: FormItemType.other,
                        name: 'button',
                        dom: (
                            <div className="flex-center">
                                <Button onClick={submit} className="m-l-65 m-t-40" type="primary">
                                    提交
                                </Button>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    )
}

function WorkOrderTable() {
    const { setWorkOrderEditor, setModalWorkDetailShow } = PageStore.useContainer()
    const { currentApp } = GlobalStore.useContainer()
    const histort = useHistory()
    const { reload, list, total, status } = usePage<IWordOrder>({
        url: '/api/get_gongdan_list',
        pageSize: 10,
        query: {},
        onAjaxBefore: AjAxPageCommonSetting.buildOnAjaxBefore({ appid: currentApp!.id }),
        onAjaxAfter: AjAxPageCommonSetting.onAjaxAfter,
        isInitFetch: true,
    })
    const deleteWorkOrder = (id: string) => {
        ChUtils.Ajax.request({
            url: '/api/del_gongdan_by_id',
            data: {
                id,
            },
        }).then((res) => {
            if (res.code === 0) {
                reload()
            }
        })
    }
    const getDetail = (id: string) => {
        histort.push(`/applicationCenter/workOrder/detail/${id}`)
        // ChUtils.Ajax.request({
        //     url: '/api/get_gongdan_by_id',
        //     data: {
        //         id,
        //     },
        // }).then((res) => {
        //     if (res.code == 0) {
        //         setWorkOrderEditor(res.data)
        //         setModalWorkDetailShow(true)
        //     }
        // })
    }
    const columns: ColumnsType<IWordOrder> = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: '标题', dataIndex: 'title', key: 'title' },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                return MWorkOrderStatusMap.get(status)
            },
        },
        {
            title: '创建时间',
            dataIndex: 'create_at',
            key: 'create_at',
            render: (create_at) => {
                return ChUtils.chFormats.formatDate(create_at * 1000)
            },
        },
        {
            title: '操作',
            dataIndex: 'option',
            key: 'option',
            render: (_: any, item: IWordOrder) => {
                return (
                    <div>
                        <a
                            onClick={() => {
                                getDetail(item.id)
                            }}
                        >
                            详情
                        </a>
                        <Popconfirm title="确认删除该工单吗?" onConfirm={() => deleteWorkOrder(item.id)}>
                            <Button type="link" danger>
                                删除
                            </Button>
                        </Popconfirm>
                    </div>
                )
            },
        },
    ]
    return (
        <div className="p-l-40 p-r-40">
            <div className="m-t-20 m-b-20 button-add-1"></div>
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
    const { setPageTab, pageTab } = PageStore.useContainer()
    const handleMenuClick = (e: any) => {
        setPageTab(e.key)
    }
    return (
        <div className="applicationCenter-common-header">
            <div style={{ width: '100%' }}>
                <Menu onClick={(e) => handleMenuClick(e)} selectedKeys={[pageTab]} mode="horizontal">
                    <Menu.Item key="1">我的工单</Menu.Item>
                    <Menu.Item key="2">提交工单</Menu.Item>
                </Menu>
            </div>
        </div>
    )
}

function WorkOrder() {
    const { pageTab } = PageStore.useContainer()

    return (
        <div>
            <ModalWordDetail />
            <Header></Header>
            {pageTab === '1' ? <WorkOrderTable /> : <WorkOrderForm />}
        </div>
    )
}

export default () => (
    <PageStore.Provider>
        <WorkOrder />
    </PageStore.Provider>
)
