import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { IReplay, IWorkOrderDetail, MWorkOrderStatusMap } from '../interface'
import { ChUtils } from 'ch-ui'
import { Typography, Steps, Row, Col, Divider, Button, Tag, Switch, message, notification } from 'antd'
import QuillEditor from '../../../component/from/QuillEditor'
import { createContainer } from 'unstated-next'
const { Title, Paragraph } = Typography
const { Step } = Steps

function usePageStore() {
    const [workOrderDetail, setWorkOrderDetail] = useState<IWorkOrderDetail>()
    const [replays, setReplays] = useState<IReplay[]>()
    const fetchWorkOrderDetail = (id: string) => {
        ChUtils.Ajax.request({
            url: '/api/get_gongdan_by_id',
            data: {
                id,
            },
        }).then((res) => {
            if (res.code === 0) {
                setWorkOrderDetail(res.data)
            }
        })
    }
    const fetchReplays = (id: string) => {
        ChUtils.Ajax.request({
            url: '/api/get_replay_by_id',
            data: {
                id,
            },
        }).then((res) => {
            if (res.code === 0) {
                setReplays(res.data)
            }
        })
    }
    return {
        workOrderDetail,
        setWorkOrderDetail,
        fetchWorkOrderDetail,
        fetchReplays,
        replays,
    }
}

const PageStore = createContainer(usePageStore)

function WorkOrderInfo() {
    const { workOrderDetail } = PageStore.useContainer()

    return (
        <div className="work-order-info">
            <Row>
                <div className="work-order-info-item">
                    <div className="work-order-info-item-label">工单标题</div>
                    <div className="work-order-info-item-value m-l-20">{workOrderDetail?.Title}</div>
                </div>
            </Row>
            <Row>
                <Col span={8}>
                    <div className="flex-row-center">
                        <div>工单编号</div>
                        <div className="m-l-20">{workOrderDetail?.Id}</div>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="flex-center">
                        <div>创建时间</div>
                        <div className="m-l-20">{workOrderDetail?.CreateAt && ChUtils.chFormats.formatDate(workOrderDetail?.CreateAt * 1000)}</div>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="flex-center">
                        <div>状态</div>
                        <Tag color={workOrderDetail?.Status === 1 ? 'warning' : workOrderDetail?.Status === 2 ? 'success' : 'default'} className="m-l-20">
                            {MWorkOrderStatusMap.get((workOrderDetail?.Status || '0') + '')}
                        </Tag>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

function WorkOrderStep() {
    const { workOrderDetail } = PageStore.useContainer()

    return (
        <div className="step-wrap m-b-30">
            <Steps type="navigation" current={workOrderDetail?.Status} onChange={() => {}} className="site-navigation-steps">
                <Step status="process" title="处理中" />
                <Step status="wait" title="已处理" />
                <Step status="wait" title="已解决" />
            </Steps>
        </div>
    )
}

function WorkOrderRecords() {
    const { workOrderDetail, replays } = PageStore.useContainer()

    return (
        <div className="work-order-records">
            <Paragraph>
                <h5>工单内容</h5>
                <pre>
                    <div dangerouslySetInnerHTML={{ __html: workOrderDetail ? workOrderDetail.Contents : '' }} />
                </pre>
                <h5 className="m-t-40">沟通记录</h5>
                {replays?.map((item, index) => {
                    return (
                        <div className="m-b-40" key={index}>
                            <div>
                                <div>{item.nickname}</div>
                                <div>{ChUtils.chFormats.formatDate(Number(item.replay_time) * 1000)}</div>
                            </div>
                            <blockquote>
                                <div dangerouslySetInnerHTML={{ __html: item.contents }} />
                            </blockquote>
                        </div>
                    )
                })}
            </Paragraph>
        </div>
    )
}

function WorkOrderDetail() {
    const { fetchWorkOrderDetail, workOrderDetail, fetchReplays } = PageStore.useContainer()
    const [isResolve, setIsResolve] = useState(false)
    const [comment, setComment] = useState('')
    const history = useHistory()
    const location = useLocation()
    const splitPath = location.pathname.split('/')
    const id = splitPath[splitPath.length - 1]
    const re = /^[0-9]+.?[0-9]*/
    if (!re.test(id)) {
        return <div>工单不存在</div>
    }
    useEffect(() => {
        fetchWorkOrderDetail(id)
        fetchReplays(id)
    }, [id])

    const submit = () => {
        if (isResolve) {
            ChUtils.Ajax.request({
                url: '/api/up_gongdan_state',
                data: {
                    state: 2,
                    id: workOrderDetail?.Id,
                },
            }).then((res) => {
                if (comment === '') {
                    history.replace('/applicationCenter/workOrder')
                }
            })
        }
        if (!isResolve && comment === '') {
            message.error('内容不能为空')
            return
        }
        if (comment && comment !== '') {
            ChUtils.Ajax.request({
                url: '/api/add_reply',
                data: {
                    contents: comment,
                    gongdan_id: workOrderDetail?.Id,
                },
            }).then(() => {
                notification.success({ message: '提交成功' })
                setComment('')
                history.replace('/applicationCenter/workOrder')
            })
        }
    }

    return (
        <div style={{ height: 0 }} className="applicationCenter-work-orderDetail p-l-40 p-r-40 p-t-30">
            <WorkOrderStep />
            <Divider dashed />
            <WorkOrderInfo />
            <Divider dashed />
            <WorkOrderRecords />
            <Divider />
            <QuillEditor
                style={{ height: 300 }}
                value={comment}
                onChange={(v) => {
                    setComment(v)
                }}
            />
            {workOrderDetail?.Status != 2 && (
                <div className="m-t-30 m-b-20">
                    <div className="flex-row-center m-t-30">
                        <div>是否解决：</div> <Switch onChange={(e) => setIsResolve(e)} />
                    </div>
                    <div className="flex-center">
                        <Button onClick={submit} type="primary" className="button-add-1 m-t-20 m-b-20">
                            提交
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default () => (
    <PageStore.Provider>
        <WorkOrderDetail />
    </PageStore.Provider>
)
