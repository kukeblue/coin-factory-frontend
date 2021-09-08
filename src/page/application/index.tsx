import React, { useEffect, useState } from 'react'
import { AppstoreOutlined, LeftOutlined, PoweroffOutlined } from '@ant-design/icons'
import './index.less'
import { Card, Col, message, Modal, Row, Tag, Button, Spin, notification } from 'antd'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import { useHistory } from 'react-router-dom'
import ChImageUpload from '../../component/from/ChImageUpload'
import { useForm } from 'antd/lib/form/Form'
import { createContainer } from 'unstated-next'
import { GlobalStore } from '../../store/globalStore'

function useApplicationPageStore() {
    const [showAddApplicationModal, setShowAddApplicationModal] = useState(false)
    const [apps, setApps] = useState<IApplication[]>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchApps()
    }, [])

    const fetchApps = () => {
        ChUtils.Ajax.request({
            url: '/api/get_app_list',
            method: 'post',
            data: {},
        }).then((res) => {
            if (res.data) {
                setApps(res.data)
            }
        })
    }

    return {
        showAddApplicationModal,
        setShowAddApplicationModal,
        apps,
        setApps,
        loading,
        setLoading,
        fetchApps,
    }
}

const ApplicationPageStore = createContainer(useApplicationPageStore)

function ApplicationCards() {
    const { setShowAddApplicationModal, apps, setApps, loading, setLoading } = ApplicationPageStore.useContainer()
    const { setCurrentApp } = GlobalStore.useContainer()

    const statusColor = (status: string) => {
        return status === '已过期' ? '#f43b3a' : status === '即将过期' ? '#f50' : '#87d068'
    }

    return (
        <Spin spinning={loading}>
            <Row wrap className="m-t-20">
                <Col className="flex-center" span={8}>
                    <Card hoverable className="application-card">
                        <div
                            onClick={() => {
                                setShowAddApplicationModal(true)
                            }}
                            style={{ marginTop: 30 }}
                            className="flex-column-all-center"
                        >
                            <div className="create-application-icon"></div>
                            <div className="create-application">新建应用</div>
                        </div>
                    </Card>
                </Col>

                {apps?.map((app) => {
                    return (
                        <Col key={app.id} className="flex-center" span={8}>
                            <Card hoverable className="application-card">
                                <div className="flex-row-center">
                                    <img className="application-logo m-r-5" src={app.logo}></img>
                                    <div className="application-name m-r-10">{app.app_name}</div>
                                    <Tag color={statusColor(app.status)} className="application-status flex-center">
                                        {app.status}
                                    </Tag>
                                </div>
                                <div className="flex-row-center m-t-10 m-b-10">
                                    <div>
                                        <Tag style={{ borderRadius: 10 }} color="default">
                                            试用版
                                        </Tag>
                                    </div>
                                    <div>
                                        <Tag style={{ borderRadius: 10 }} color="default">
                                            高级管理员
                                        </Tag>
                                    </div>
                                </div>
                                <div className="flex-between m-t-35">
                                    <div className="application-validity">有效期至：{new Date(app.end_time * 1000).toLocaleDateString()}</div>
                                    <div>
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                setLoading(true)
                                                setTimeout(() => {
                                                    setLoading(false)
                                                    setCurrentApp(app)
                                                    notification.success({ message: '切换应用成功' })
                                                }, 1000)
                                            }}
                                            size="small"
                                            shape="round"
                                        >
                                            进入应用
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    )
                })}
            </Row>
        </Spin>
    )
}

function AddApplication() {
    const { showAddApplicationModal, setShowAddApplicationModal, fetchApps } = ApplicationPageStore.useContainer()
    const [formRef] = useForm()
    return (
        <Modal
            destroyOnClose={true}
            visible={showAddApplicationModal}
            okText="确定"
            cancelText="取消"
            onCancel={() => {
                setShowAddApplicationModal(false)
            }}
            onOk={() => {
                formRef.validateFields().then((res) => {
                    ChUtils.Ajax.request({
                        url: '/api/create_app',
                        method: 'post',
                        data: {
                            app_name: res.app_name,
                            logo: res.logo[0].response && res.logo[0].response.data.File ? res.logo[0].response.data.File : '',
                        },
                    }).then((res) => {
                        if (res.code === 0) {
                            message.success('应用创建成功！')
                            setShowAddApplicationModal(false)
                            fetchApps()
                        } else {
                            message.error(res.msg)
                        }
                    })
                })
            }}
        >
            <div className="title-modal m-b-30">新建应用</div>
            <ChForm
                form={formRef}
                formData={[
                    {
                        type: FormItemType.input,
                        name: 'app_name',
                        label: '应用名称',
                        placeholder: '请输入应用名称',
                        rules: [{ required: true, message: '应用名称不能为空' }],
                    },
                    {
                        type: FormItemType.other,
                        name: 'logo',
                        label: '应用Logo',
                        initialValue: [],
                        dom: <ChImageUpload />,
                        rules: [{ required: true, message: '应用logo不能为空' }],
                    },
                ]}
            />
        </Modal>
    )
}

function Application() {
    const history = useHistory()
    return (
        <div className="application-page">
            <div className="flex-between application-top">
                <div className="application-title">
                    <AppstoreOutlined />
                    应用管理
                </div>
                <div
                    onClick={() => {
                        history.goBack()
                    }}
                    className="application-back"
                >
                    <LeftOutlined />
                    返回
                </div>
            </div>
            <div className="application-content">
                <ApplicationCards />
                <AddApplication />
            </div>
        </div>
    )
}

export default () => (
    <ApplicationPageStore.Provider>
        <Application />
    </ApplicationPageStore.Provider>
)
