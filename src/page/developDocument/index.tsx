import React, { useState } from 'react'
import { Menu } from 'antd'
import './index.less'
import Markdown from 'markdown-to-jsx'
import { ReadOutlined } from '@ant-design/icons'
// import remarkGfm from 'remark-gfm'
import md_index from '../../md/index.md'
import md_address from '../../md/生成地址.md'

const { SubMenu } = Menu

function DevelopDocument() {
    const [currentDoc, setCurrentDoc] = useState(md_index)
    return (
        <div className="common-page">
            <div className="common-page-body flex-center">
                <div className="common-page-side">
                    <div className="common-page-side-icon flex-column-all-center">
                        <div className="icon-vbg-green flex-center m-b-10">
                            <ReadOutlined />
                        </div>
                        <div className="side-icon-text">开发文档</div>
                    </div>
                    <Menu style={{ width: '100%', marginTop: 50 }} className="m-t-10" mode="inline">
                        <SubMenu
                            key="1"
                            title={
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>产品介绍</span>
                                </div>
                            }
                        >
                            <Menu.Item
                                key="1-1"
                                onClick={() => {
                                    setCurrentDoc(md_index)
                                }}
                            >
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>产品简介</span>
                                </div>
                            </Menu.Item>
                            <Menu.Item key="1-2">
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>SDK下载</span>
                                </div>
                            </Menu.Item>
                            <Menu.Item key="1-3">
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>服务方式</span>
                                </div>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="2"
                            title={
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>接口文档</span>
                                </div>
                            }
                        >
                            <Menu.Item
                                key="2-1"
                                onClick={() => {
                                    setCurrentDoc(md_address)
                                }}
                            >
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>生成地址</span>
                                </div>
                            </Menu.Item>
                            <Menu.Item key="2-2">
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>查询余额</span>
                                </div>
                            </Menu.Item>
                            <Menu.Item key="2-3">
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>查询汇率</span>
                                </div>
                            </Menu.Item>
                            <Menu.Item key="2-4">
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>充值记录</span>
                                </div>
                            </Menu.Item>
                            <Menu.Item key="2-5">
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>提币</span>
                                </div>
                            </Menu.Item>
                            <Menu.Item key="2-6">
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>检验地址合法性</span>
                                </div>
                            </Menu.Item>
                            <Menu.Item key="2-7">
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>检验地址是否存在</span>
                                </div>
                            </Menu.Item>
                            <Menu.Item key="2-8">
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>交易回调</span>
                                </div>
                            </Menu.Item>
                            <Menu.Item key="2-9">
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>币种行情</span>
                                </div>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
                <div className="common-page-content developDocument-content">
                    <div className="p-40 md-content markdown-body">
                        <Markdown>{currentDoc}</Markdown>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DevelopDocument
