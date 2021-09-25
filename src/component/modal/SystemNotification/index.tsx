import React, { useEffect, useState } from 'react'
import { Modal, Badge } from 'antd'
import './index.less'
import LargeTextView from '../../format/LargeTextView/LargeTextView'
import { GlobalStore } from '../../../store/globalStore'
import { ChUtils } from 'ch-ui'
import { ISystemNotification } from '../../../typings'

interface INotificationDetail {
    Id: number
    UserId: number
    Title: string
    Content: string
    IsSee: number
    State: number
    CreateTime: number
}

function SystemNotification() {
    const [messageList, setMessageList] = useState<ISystemNotification[]>([])
    const [modalNotificationDetailShow, setModalNotificationDetailShow] = useState(false)
    const { modalSystemNotificationShow, setModalSystemNotificationShow, userInfo } = GlobalStore.useContainer()
    const [notificationDetail, setNotificationDetail] = useState<INotificationDetail>()

    useEffect(() => {
        if (!userInfo) return
        if (!modalSystemNotificationShow) return
        ChUtils.Ajax.request({
            url: '/api/get_message_list',
            data: {
                page: 1,
                limit: 500,
            },
        }).then((res) => {
            if (res.code === 0) {
                setMessageList(res.data.list)
            }
        })
    }, [modalSystemNotificationShow])

    const viewDetail = (id: string) => {
        ChUtils.Ajax.request({
            url: '/api/get_message_info',
            data: {
                id,
            },
        }).then((res) => {
            if (res.code === 0) {
                setNotificationDetail(res.data)
                setModalNotificationDetailShow(true)
            }
        })
    }

    return (
        <>
            <Modal centered width={600} onCancel={() => setModalSystemNotificationShow(false)} footer={false} visible={modalSystemNotificationShow} title="消息列表">
                <div className="systemNotification-list">
                    {messageList.map((item) => {
                        return (
                            <div
                                onClick={() => {
                                    viewDetail(item.id)
                                }}
                                key={item.id}
                                className={item.is_see !== '0' ? 'systemNotification-item flex-row-center' : 'systemNotification-item unread flex-row-center'}
                            >
                                {item.is_see !== '0' ? <div /> : <Badge color="pink" />}
                                <div className="systemNotification-icon m-r-10" />
                                <div style={{ flex: 1 }}>
                                    <div className="flex-between">
                                        <div className="systemNotification-title">{item.title}</div>
                                        <div className="systemNotification-time">{ChUtils.chFormats.formatDate(Number(item.create_time) * 1000)}</div>
                                    </div>
                                    <div className="systemNotification-meesgae m-t-5">
                                        <LargeTextView disableTooltip text={item.content} />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Modal>
            <Modal width={600} onCancel={() => setModalNotificationDetailShow(false)} footer={false} visible={modalNotificationDetailShow} title="消息详情">
                <div className="systemNotification-body">
                    <div className="title">{notificationDetail?.Title}</div>
                    <div className="tiem">{notificationDetail?.CreateTime ? ChUtils.chFormats.formatDate(notificationDetail?.CreateTime * 1000) : ''}</div>
                    <div className="content">{notificationDetail?.Content}</div>
                </div>
            </Modal>
        </>
    )
}
export default SystemNotification
