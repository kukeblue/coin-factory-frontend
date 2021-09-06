import React, { useCallback, useEffect, useState } from 'react'
import { Button, Dropdown, Menu, message, Modal, Switch, Table, Tag } from 'antd'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import { GlobalStore } from '../../../store/globalStore'
import { IOpenCoin } from '../../../typings'
import { ICanOpenCoin } from '../interface'
import { createContainer } from 'unstated-next'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import QRCodeViewer from '../../../component/modal/QRCodeViewer'
import TextArea from 'antd/lib/input/TextArea'
import Authenticator from '../../../component/auth/Authenticator'

function useOpenCoinsPageStore() {
    const { currentApp } = GlobalStore.useContainer()
    const [coinEditing, setCoinEditing] = useState<IOpenCoin>()
    const [canOpenCoinListModal, setCanOpenCoinListModal] = useState(false)
    const [coins, setCoins] = useState<IOpenCoin[]>([])
    const [coinsTableLoading, setCoinsTableLoading] = useState(false)
    const [modalImportPrivateKeyShow, setModalImportPrivateKeyShow] = useState(false)
    const [modalWalletSettingShow, setModalWalletSettingShow] = useState(false)

    const fetchCoins = useCallback(() => {
        setCoinsTableLoading(true)
        ChUtils.Ajax.request({
            url: '/api/get_open_coins',
            method: 'post',
            data: {
                appid: currentApp.id,
            },
        })
            .then((res) => {
                if (res.code === 0) {
                    setCoins(res.data)
                }
            })
            .finally(() => {
                setCoinsTableLoading(false)
            })
    }, [currentApp.id])

    useEffect(() => {
        fetchCoins()
    }, [fetchCoins])

    return {
        modalWalletSettingShow,
        setModalWalletSettingShow,
        coinEditing,
        setCoinEditing,
        fetchCoins,
        coins,
        setCoins,
        canOpenCoinListModal,
        setCanOpenCoinListModal,
        modalImportPrivateKeyShow,
        setModalImportPrivateKeyShow,
        coinsTableLoading,
    }
}

const OpenCoinsPageStore = createContainer(useOpenCoinsPageStore)

function ModalImportPrivateKey() {
    const [privateKey, setPrivateKey] = useState<string>()
    const { modalImportPrivateKeyShow, setModalImportPrivateKeyShow, coinEditing } = OpenCoinsPageStore.useContainer()
    const { currentApp } = GlobalStore.useContainer()

    const doImportPrivateKey = () => {
        if (privateKey && privateKey !== '') {
            ChUtils.Ajax.request({
                url: '/api/import_pri',
                data: {
                    privatekey: privateKey,
                    appid: currentApp.id,
                    id: coinEditing!.id,
                },
            })
        } else {
            message.error('密钥不能为空')
        }
    }

    return (
        <Modal onOk={doImportPrivateKey} onCancel={() => setModalImportPrivateKeyShow(false)} destroyOnClose visible={modalImportPrivateKeyShow}>
            <div className="title-modal m-b-30">导入私钥</div>
            <TextArea
                onChange={(e) => {
                    setPrivateKey(e.target.value)
                }}
                rows={10}
            ></TextArea>
        </Modal>
    )
}

function ModalWalletSetting() {
    const { setModalImportPrivateKeyShow, modalWalletSettingShow, coinEditing } = OpenCoinsPageStore.useContainer()
    const { currentApp } = GlobalStore.useContainer()
    useEffect(() => {
        if (coinEditing) {
            ChUtils.Ajax.request({
                url: '/api/export_pri',
                data: {
                    symbol: coinEditing?.symbol,
                    appid: currentApp.id,
                },
            })
        }
    }, [coinEditing, currentApp])

    return (
        <Modal destroyOnClose visible={modalWalletSettingShow}>
            <ModalImportPrivateKey />
            <div className="title-modal m-b-30">冷热钱包设置</div>
            <ChForm
                layout={{ labelCol: { span: 4 }, wrapperCol: { span: 16, offset: 1 } }}
                formData={[
                    {
                        type: FormItemType.other,
                        label: '热钱包',
                        name: 'hotWallet',
                        dom: (
                            <div>
                                <div className="flex-row-center">
                                    <div>热钱包.....</div>
                                    <div>
                                        <CopyToClipboard
                                            text={'热钱包'}
                                            onCopy={() => {
                                                message.success('复制成功')
                                            }}
                                        >
                                            <div className="copy-button"></div>
                                        </CopyToClipboard>
                                    </div>
                                    <div style={{ position: 'relative', left: '-10px' }}>
                                        <QRCodeViewer />
                                    </div>
                                    <div>
                                        <a onClick={() => setModalImportPrivateKeyShow(true)}>导入私钥</a>
                                    </div>
                                </div>
                                <div className="m-t-10">
                                    <a>导出热钱包私钥</a>
                                </div>
                            </div>
                        ),
                    },
                    {
                        type: FormItemType.input,
                        label: '冷钱包',
                        name: 'ColdAddr',
                    },
                ]}
            ></ChForm>
        </Modal>
    )
}

function ModalCanOpenCoinList() {
    const [list, setList] = useState<ICanOpenCoin[]>()
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>()
    const { canOpenCoinListModal, setCanOpenCoinListModal, fetchCoins } = OpenCoinsPageStore.useContainer()
    const { currentApp } = GlobalStore.useContainer()

    useEffect(() => {
        if (canOpenCoinListModal) {
            setSelectedRowKeys([])
        }
    }, [canOpenCoinListModal])

    useEffect(() => {
        ChUtils.Ajax.request({
            url: '/api/get_user_coins',
        }).then((res) => {
            if (res.code == 0) {
                setList(res.data)
            }
        })
    }, [])
    const submit = () => {
        ChUtils.Ajax.request({
            url: '/api/open_coins',
            data: {
                symbols: selectedRowKeys,
                appid: currentApp.id,
            },
        }).then((res) => {
            if (res.code == 0) {
                setCanOpenCoinListModal(false)
                fetchCoins()
            }
        })
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[]) => {
            console.log(selectedRowKeys)
            setSelectedRowKeys(selectedRowKeys)
        },
    }
    return (
        <Modal
            destroyOnClose={true}
            onCancel={() => {
                setCanOpenCoinListModal(false)
            }}
            onOk={submit}
            width={800}
            visible={canOpenCoinListModal}
        >
            <div className="title-modal flex-center m-b-50">可开通钱包列表</div>
            <div className="m-b-20">
                <div className="m-b-10">已选币种:</div>
                <div>
                    {selectedRowKeys?.map((symbol) => {
                        return <Tag key={symbol}>{symbol}</Tag>
                    })}
                </div>
            </div>
            <Table
                rowKey="symbol"
                rowSelection={rowSelection}
                dataSource={list}
                columns={[
                    {
                        title: '币种',
                        width: 300,
                        dataIndex: 'coin_name',
                        key: 'coin_name',
                        render: (_: string, item: ICanOpenCoin) => {
                            return (
                                <div className="flex-row-center">
                                    {item.icon ? <img src={item.icon} className="coin-pic m-r-10"></img> : <div className="coin-pic m-r-10"></div>}
                                    <div>
                                        <div className="coin-name-en">{item.symbol}</div>
                                        <div className="coin-name">{item.coin_text}</div>
                                    </div>
                                </div>
                            )
                        },
                    },
                ]}
            ></Table>
        </Modal>
    )
}

function Header() {
    const { setCanOpenCoinListModal } = OpenCoinsPageStore.useContainer()
    return (
        <div className="applicationCenter-common-header">
            <div style={{ width: '100%' }}>
                <Menu defaultSelectedKeys={['0']} mode="horizontal">
                    <Menu.Item key="1">全部</Menu.Item>
                </Menu>
            </div>
            <Button
                onClick={() => {
                    setCanOpenCoinListModal(true)
                }}
                type="primary"
                className="header-button"
            >
                添加
            </Button>
        </div>
    )
}

function OpenedCoinsTable() {
    const { canOpenCoinListModal, coins, setCoinEditing, setModalWalletSettingShow, coinsTableLoading } = OpenCoinsPageStore.useContainer()

    const columns = [
        {
            title: '币种',
            dataIndex: 'coin_name',
            key: 'coin_name',
        },
        {
            title: '简称',
            dataIndex: 'symbol',
            key: 'symbol',
        },
        {
            title: '地址数',
            dataIndex: '3',
            key: '3',
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: (state: number) => <Switch checked={state != 0}></Switch>,
        },
        {
            title: '操作',
            dataIndex: '0',
            key: '0',
            render: (_: any, item: IOpenCoin) => {
                return (
                    <>
                        <a className="m-r-10">查看</a>
                        <Dropdown
                            overlay={
                                <Menu>
                                    <Menu.Item key="1">
                                        <Authenticator
                                            callback={() => {
                                                setModalWalletSettingShow(true)
                                                setCoinEditing(item)
                                            }}
                                        >
                                            <a className="coin-option-item" target="_blank">
                                                冷热钱包设置
                                            </a>
                                        </Authenticator>
                                    </Menu.Item>
                                    <Menu.Item key="2">
                                        <a className="coin-option-item" target="_blank">
                                            充值归集设置
                                        </a>
                                    </Menu.Item>
                                    <Menu.Item key="3">
                                        <a target="_blank">手续费设置</a>
                                    </Menu.Item>
                                    <Menu.Item danger key="4">
                                        <a target="_blank">删除</a>
                                    </Menu.Item>
                                </Menu>
                            }
                        >
                            <a>操作</a>
                        </Dropdown>
                    </>
                )
            },
        },
    ]
    return (
        <div className="p-l-40 p-r-40">
            <Table loading={coinsTableLoading} rowKey="id" dataSource={coins} columns={columns}></Table>
        </div>
    )
}

function Page() {
    return (
        <div className="applicationCenter-openCoins">
            <Header />
            <OpenedCoinsTable />
            <ModalWalletSetting />
            <ModalCanOpenCoinList />
        </div>
    )
}

export default () => (
    <OpenCoinsPageStore.Provider>
        <Page />
    </OpenCoinsPageStore.Provider>
)
