import React, { useEffect, useState } from 'react'
import { AppstoreOutlined, LeftOutlined } from '@ant-design/icons'
import './index.less'
import { Col, Row, Tag } from 'antd'
import { ChUtils } from 'ch-ui'

function ApplicationCards() {
    const [apps, setApps] = useState<IApplication[]>()
    useEffect(() => {
        ChUtils.Ajax.request({
            url: '/api/get_app_list',
            method: 'post',
            data: {},
        }).then((res) => {
            if (res.data) {
                setApps(res.data)
            }
        })
    }, [])

    return (
        <Row wrap className="m-t-20">
            <Col className="flex-center" span={8}>
                <div className="application-card flex-column-all-center">
                    <div className="create-application-icon"></div>
                    <div className="create-application">新建应用</div>
                </div>
            </Col>

            {apps?.map((app) => {
                return (
                    <Col className="flex-center" span={8}>
                        {' '}
                        <div className="application-card">
                            <div className="flex-row-center">
                                <div className="application-name m-r-10">{app.app_name}</div>
                                <div className="application-status flex-center">已过期</div>
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
                                    <Tag style={{ borderRadius: 10, cursor: 'pointer' }} color="#29B6B0">
                                        进入应用
                                    </Tag>
                                </div>
                            </div>
                        </div>
                    </Col>
                )
            })}
        </Row>
    )
}

function Application() {
    return (
        <div className="application-page">
            <div className="flex-between application-top">
                <div className="application-title">
                    <AppstoreOutlined />
                    应用管理
                </div>
                <div className="application-back">
                    <LeftOutlined />
                    返回
                </div>
            </div>
            <div className="application-content">
                <ApplicationCards />
            </div>
        </div>
    )
}

export default Application
