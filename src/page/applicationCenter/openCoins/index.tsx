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
import { useForm } from 'antd/lib/form/Form'
import CoinTemplate from '../../../component/template/CoinTemplate'
import { util } from 'prettier'
import { notification } from 'antd/es'

function useOpenCoinsPageStore() {
    const { currentApp } = GlobalStore.useContainer()
    const [coinEditing, setCoinEditing] = useState<IOpenCoin>()
    const [canOpenCoinListModal, setCanOpenCoinListModal] = useState(false)
    const [coins, setCoins] = useState<IOpenCoin[]>([])
    const [coinsTableLoading, setCoinsTableLoading] = useState(false)
    const [modalImportPrivateKeyShow, setModalImportPrivateKeyShow] = useState(false)
    const [modalWalletSettingShow, setModalWalletSettingShow] = useState(false)
    const [modalPayThresholdValueSetting, setModalPayThresholdValueSetting] = useState(false)
    const [modalDeleteAppCoin, setModalDeleteAppCoin] = useState(false)

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
        modalPayThresholdValueSetting,
        setModalPayThresholdValueSetting,
        modalDeleteAppCoin,
        setModalDeleteAppCoin,
    }
}

const OpenCoinsPageStore = createContainer(useOpenCoinsPageStore)

function ModalDeleteAppCoin() {
    const { modalDeleteAppCoin, setModalDeleteAppCoin, coinEditing, fetchCoins } = OpenCoinsPageStore.useContainer()
    const { currentApp } = GlobalStore.useContainer()
    return (
        <Modal
            onCancel={() => {
                setModalDeleteAppCoin(false)
            }}
            onOk={() => {
                ChUtils.Ajax.request({
                    url: '/api/del_coins',
                    data: {
                        id: coinEditing?.id,
                        appid: currentApp.id,
                    },
                }).then((res) => {
                    if (res.code === 0) {
                        notification.success({ message: '删除成功' })
                        fetchCoins()
                        setModalDeleteAppCoin(false)
                    }
                })
            }}
            okButtonProps={{ danger: true }}
            title="删除应用"
            visible={modalDeleteAppCoin}
        >
            应用删除后，数据不可恢复，确认删应用？
        </Modal>
    )
}
// 充值归集弹框
function ModalPayThresholdValueSetting() {
    const { setModalPayThresholdValueSetting, modalPayThresholdValueSetting, coinEditing } = OpenCoinsPageStore.useContainer()
    const { currentApp } = GlobalStore.useContainer()
    const [formRef] = useForm()

    useEffect(() => {
        if (modalPayThresholdValueSetting) {
            formRef.resetFields()
        }
    }, [modalPayThresholdValueSetting])

    const submit = () => {
        formRef.validateFields().then((values) => {
            ChUtils.Ajax.request({
                url: '/api/set_limit',
                data: {
                    ...values,
                    appid: currentApp.id,
                    id: coinEditing?.id,
                },
            }).then((res) => {
                if (res.code == 0) {
                    setModalPayThresholdValueSetting(false)
                    notification.success({ message: '保存成功' })
                }
            })
        })
    }
    return (
        <Modal
            destroyOnClose={true}
            title="充值归集设置"
            onCancel={() => {
                setModalPayThresholdValueSetting(false)
            }}
            onOk={submit}
            visible={modalPayThresholdValueSetting}
        >
            <ChForm
                form={formRef}
                layout={{
                    labelCol: { span: 6 },
                    wrapperCol: { span: 16 },
                }}
                formData={[
                    {
                        type: FormItemType.input,
                        label: '充值监控上限',
                        name: 'recharge_upper_limit',
                        rules: [
                            {
                                required: true,
                                message: '请输入充值监控上限',
                            },
                        ],
                    },
                    {
                        type: FormItemType.input,
                        label: '归集数量下限',
                        name: 'together_upper_limit',
                        rules: [
                            {
                                required: true,
                                message: '请输入归集数量下限',
                            },
                        ],
                    },
                ]}
            />
        </Modal>
    )
}

function ModalImportPrivateKey() {
    const [privateKey, setPrivateKey] = useState<string>()
    const [loadingGetPrivateKey, setLoadingGetPrivateKey] = useState<boolean>(false)
    const { modalImportPrivateKeyShow, setModalImportPrivateKeyShow, coinEditing } = OpenCoinsPageStore.useContainer()
    const { currentApp } = GlobalStore.useContainer()
    const buildSystemPrivateKey = () => {
        setLoadingGetPrivateKey(true)
        setPrivateKey('')
        ChUtils.Ajax.request({
            url: '/api/get_pub_addr',
            data: {
                appid: currentApp.id,
                id: coinEditing?.id,
            },
        })
            .then((res) => {
                if (res.code === 0) {
                    setPrivateKey(res.data)
                }
            })
            .finally(() => {
                setLoadingGetPrivateKey(false)
            })
    }
    const doImportPrivateKey = () => {
        if (privateKey && privateKey !== '') {
            ChUtils.Ajax.request({
                url: '/api/import_pri',
                data: {
                    privatekey: privateKey,
                    appid: currentApp.id,
                    id: coinEditing!.id,
                },
            }).then((res) => {
                if (res.code === 0) {
                    setModalImportPrivateKeyShow(false)
                    notification.success({ message: '导入私钥成功' })
                }
            })
        } else {
            message.error('私钥不能为空')
        }
    }

    return (
        <Modal maskClosable={false} onOk={doImportPrivateKey} onCancel={() => setModalImportPrivateKeyShow(false)} destroyOnClose visible={modalImportPrivateKeyShow}>
            <div className="title-modal m-b-30">导入私钥</div>
            <TextArea
                value={privateKey}
                className="m-b-15"
                onChange={(e) => {
                    setPrivateKey(e.target.value)
                }}
                rows={3}
            />
            <Button loading={loadingGetPrivateKey} type="link" onClick={buildSystemPrivateKey}>
                系统生成
            </Button>
        </Modal>
    )
}

function ModalWalletSetting() {
    const { setModalImportPrivateKeyShow, modalWalletSettingShow, coinEditing, setModalWalletSettingShow } = OpenCoinsPageStore.useContainer()
    const [currentPrivateKey, setCurrentPrivateKey] = useState<string>()
    const [hotWalletKey, setHotWalletKey] = useState<string>()
    const { currentApp } = GlobalStore.useContainer()
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [formRef] = useForm()
    useEffect(() => {
        if (!modalWalletSettingShow) return
        if (coinEditing) {
            ChUtils.Ajax.request({
                url: '/api/export_pri',
                data: {
                    symbol: coinEditing?.symbol,
                    appid: currentApp.id,
                },
            }).then((res) => {
                if (res.code == 0) {
                    setCurrentPrivateKey(res.data)
                } else {
                    setCurrentPrivateKey(undefined)
                }
            })
            ChUtils.Ajax.request({
                url: '/api/get_wallet_address',
                data: {
                    id: coinEditing?.id,
                    appid: currentApp.id,
                },
            }).then((res) => {
                if (res.code == 0) {
                    formRef.setFieldsValue({
                        ColdAddr: res.data.coldAddr,
                    })
                    setHotWalletKey(res.data.heatAddr)
                }
            })
        }
    }, [coinEditing, modalWalletSettingShow])
    const submit = () => {
        formRef.validateFields().then((values) => {
            setConfirmLoading(true)
            ChUtils.Ajax.request({
                url: '/api/bind_account',
                data: {
                    id: coinEditing?.id,
                    appid: currentApp.id,
                    ...values,
                },
            })
                .then((res) => {
                    if (res.code === 0) {
                        setModalWalletSettingShow(false)
                        notification.success({ message: '冷热钱包设置成功' })
                    }
                })
                .finally(() => {
                    setConfirmLoading(false)
                })
        })
    }
    return (
        <Modal
            maskClosable={false}
            title="冷热钱包设置"
            onCancel={() => {
                setModalWalletSettingShow(false)
            }}
            onOk={submit}
            confirmLoading={confirmLoading}
            destroyOnClose
            visible={modalWalletSettingShow}
        >
            <div className="title-modal m-b-30"></div>
            <ChForm
                form={formRef}
                layout={{ labelCol: { span: 4 }, wrapperCol: { span: 16, offset: 1 } }}
                formData={[
                    {
                        type: FormItemType.other,
                        label: '热钱包',
                        name: 'hotWallet',
                        dom: (
                            <div>
                                <div className="flex-row-center">
                                    <div>
                                        {hotWalletKey && (
                                            <CopyToClipboard
                                                text={hotWalletKey}
                                                onCopy={() => {
                                                    message.success('复制成功')
                                                }}
                                            >
                                                <span className="m-10">{hotWalletKey.substr(0, 15) + '...'}</span>
                                            </CopyToClipboard>
                                        )}
                                    </div>
                                    {/*<div>*/}
                                    {/*    <CopyToClipboard*/}
                                    {/*        text={currentPrivateKey}*/}
                                    {/*        onCopy={() => {*/}
                                    {/*            message.success('私钥复制成功')*/}
                                    {/*        }}*/}
                                    {/*    >*/}
                                    {/*        <div className="copy-button"></div>*/}
                                    {/*    </CopyToClipboard>*/}
                                    {/*</div>*/}
                                    {currentPrivateKey && (
                                        <div style={{ position: 'relative' }}>
                                            <QRCodeViewer />
                                        </div>
                                    )}
                                    {currentPrivateKey && (
                                        <div className="m-l-10">
                                            <a onClick={() => setModalImportPrivateKeyShow(true)}>导入私钥</a>
                                        </div>
                                    )}
                                </div>
                                {/*<div className="m-t-10">*/}
                                {/*    <a>导出热钱包私钥</a>*/}
                                {/*</div>*/}
                            </div>
                        ),
                    },
                    {
                        type: FormItemType.input,
                        label: '冷钱包',
                        name: 'ColdAddr',
                        rules: [{ required: true, message: '冷钱包不能为空' }],
                    },
                ]}
            />
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
                symbols: selectedRowKeys?.toString(),
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
                                        <div className="coin-name-en">{item.coin_name}</div>
                                        <div className="coin-name">{item.coin_text}</div>
                                    </div>
                                </div>
                            )
                        },
                    },
                ]}
            />
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
    const { setModalDeleteAppCoin, setModalPayThresholdValueSetting, coins, setCoinEditing, setModalWalletSettingShow, coinsTableLoading } = OpenCoinsPageStore.useContainer()
    const { currentApp } = GlobalStore.useContainer()

    const columns = [
        {
            title: '币种',
            dataIndex: 'coin_name',
            key: 'coin_name',
            render: (_: string, coin: IOpenCoin) => {
                return <CoinTemplate icon={coin.icon} name={coin.coin_name} dec={coin.coin_text} />
            },
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
            render: (state: number, ob: IOpenCoin) => (
                <Switch
                    onChange={(checked) => {
                        ChUtils.Ajax.request({
                            url: '/api/set_app_state',
                            data: { id: ob.id, appid: currentApp.id, state: checked ? 1 : 0 },
                        }).then((res) => {
                            if (res.code === 0) {
                                notification.success({ message: '修改状态成功' })
                            }
                        })
                    }}
                    defaultChecked={state !== 0}
                />
            ),
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
                                                <div>冷热钱包设置</div>
                                            </a>
                                        </Authenticator>
                                    </Menu.Item>
                                    <Menu.Item key="2">
                                        <Authenticator
                                            callback={() => {
                                                setCoinEditing(item)
                                                setModalPayThresholdValueSetting(true)
                                            }}
                                        >
                                            <a className="coin-option-item" target="_blank">
                                                <div>充值归集设置</div>
                                            </a>
                                        </Authenticator>
                                    </Menu.Item>
                                    {/*<Menu.Item key="3">*/}
                                    {/*    <a target="_blank">手续费设置</a>*/}
                                    {/*</Menu.Item>*/}
                                    <Menu.Item danger key="4">
                                        <Authenticator
                                            callback={() => {
                                                setCoinEditing(item)
                                                setModalDeleteAppCoin(true)
                                            }}
                                        >
                                            <div>删除</div>
                                        </Authenticator>
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
            <ModalImportPrivateKey />
            <ModalPayThresholdValueSetting />
            <ModalDeleteAppCoin />
        </div>
    )
}

export default () => (
    <OpenCoinsPageStore.Provider>
        <Page />
    </OpenCoinsPageStore.Provider>
)
