import React, { useState } from 'react'
import { Menu } from 'antd'
import './index.less'
import Markdown from 'markdown-to-jsx'
import { ReadOutlined } from '@ant-design/icons'
// import remarkGfm from 'remark-gfm'
import md_index from '../../md/index.md'
import md_hello from '../../md/hello.md'

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
                    <Menu openKeys={['1']} style={{ width: '100%', marginTop: 50 }} className="m-t-10" mode="inline">
                        <SubMenu
                            key="1"
                            className="common-page-side-item"
                            title={
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon"></span> <span>产品介绍</span>
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
                                    <span className="common-page-icon"></span> <span>系统简介</span>
                                </div>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
                <div className="common-page-content developDocument-content">
                    <div className="p-40 md-content">
                        <Markdown>{currentDoc}</Markdown>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DevelopDocument
