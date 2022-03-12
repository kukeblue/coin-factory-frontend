import React, { useState } from 'react'
import { Menu } from 'antd'
import './index.less'
import Markdown from 'markdown-to-jsx'
import { ReadOutlined } from '@ant-design/icons'
import md_address from '../../md/生成地址.md'
import md_balance from '../../md/查询余额.md'
import md_exchangeRate from '../../md/查询汇率.md'
import md_checkAddress from '../../md/检验地址合法性.md'
import md_checkAddressExist from '../../md/检验地址是否存在.md'
import md_exchangeCallback from '../../md/交易回调.md'
import md_coinQuotation from '../../md/币种行情.md'
import md_sign from '../../md/签名算法.md'
import md_service from '../../md/服务方式.md'
import md_rechargeRecord from '../../md/充提记录.md'
import md_withdraw from '../../md/提币.md'

const { SubMenu } = Menu

function DevelopDocument() {
    const [currentDoc, setCurrentDoc] = useState(md_service)
    const [openKeys, setOpenKeys] = useState(['1', '2'])
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
                    <Menu defaultSelectedKeys={['1-1']} openKeys={openKeys} onOpenChange={(e) => setOpenKeys(e.map((item) => item.toString()))} style={{ width: '100%', marginTop: 50 }} className="m-t-10" mode="inline">
                        <SubMenu
                            key="1"
                            title={
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span style={{ fontWeight: 700, fontSize: '15px' }}>产品介绍</span>
                                </div>
                            }
                        >
                            <Menu.Item
                                onClick={() => {
                                    setCurrentDoc(md_service)
                                }}
                                key="1-3"
                            >
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>服务方式</span>
                                </div>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="2"
                            title={
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span style={{ fontWeight: 700, fontSize: '15px' }}>接口文档</span>
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
                            <Menu.Item
                                key="2-2"
                                onClick={() => {
                                    setCurrentDoc(md_balance)
                                }}
                            >
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>查询余额</span>
                                </div>
                            </Menu.Item>
                            <Menu.Item
                                onClick={() => {
                                    setCurrentDoc(md_exchangeRate)
                                }}
                                key="2-3"
                            >
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>查询汇率</span>
                                </div>
                            </Menu.Item>
                            <Menu.Item
                                onClick={() => {
                                    setCurrentDoc(md_rechargeRecord)
                                }}
                                key="2-4"
                            >
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>充值记录</span>
                                </div>
                            </Menu.Item>
                            <Menu.Item
                                onClick={() => {
                                    setCurrentDoc(md_withdraw)
                                }}
                                key="2-5"
                            >
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>提币</span>
                                </div>
                            </Menu.Item>
                            <Menu.Item
                                onClick={() => {
                                    setCurrentDoc(md_checkAddress)
                                }}
                                key="2-6"
                            >
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>检验地址合法性</span>
                                </div>
                            </Menu.Item>
                            <Menu.Item
                                onClick={() => {
                                    setCurrentDoc(md_checkAddressExist)
                                }}
                                key="2-7"
                            >
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>检验地址是否存在</span>
                                </div>
                            </Menu.Item>
                            <Menu.Item
                                onClick={() => {
                                    setCurrentDoc(md_exchangeCallback)
                                }}
                                key="2-8"
                            >
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>交易回调</span>
                                </div>
                            </Menu.Item>
                            <Menu.Item
                                onClick={() => {
                                    setCurrentDoc(md_coinQuotation)
                                }}
                                key="2-9"
                            >
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>币种行情</span>
                                </div>
                            </Menu.Item>
                            <Menu.Item
                                onClick={() => {
                                    setCurrentDoc(md_sign)
                                }}
                                key="2-10"
                            >
                                <div className="common-page-menu-item flex-center">
                                    <span className="common-page-icon" /> <span>签名算法</span>
                                </div>
                            </Menu.Item>
                        </SubMenu>
                        <div style={{ height: '50px' }} />
                    </Menu>
                </div>
                <div className="common-page-content developDocument-content">
                    <div className="p-l-40 p-r-40 p-t-10 p-b-40 md-content markdown-body">
                        <Markdown>{currentDoc}</Markdown>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DevelopDocument
