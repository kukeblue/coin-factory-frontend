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
                appid: currentApp!.id,
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
    }, [currentApp!.id])

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
                        appid: currentApp!.id,
                    },
                }).then((res) => {
                    if (res.code === 0) {
                        notification.success({ message: '????????????' })
                        fetchCoins()
                        setModalDeleteAppCoin(false)
                    }
                })
            }}
            okButtonProps={{ danger: true }}
            title="????????????"
            visible={modalDeleteAppCoin}
        >
            ?????????????????????????????????????????????????????????
        </Modal>
    )
}
// ??????????????????
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
                    appid: currentApp!.id,
                    id: coinEditing?.id,
                },
            }).then((res) => {
                if (res.code == 0) {
                    setModalPayThresholdValueSetting(false)
                    notification.success({ message: '????????????' })
                }
            })
        })
    }
    return (
        <Modal
            destroyOnClose={true}
            title="??????????????????"
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
                        label: '??????????????????',
                        name: 'recharge_upper_limit',
                        rules: [
                            {
                                required: true,
                                message: '???????????????????????????',
                            },
                        ],
                    },
                    {
                        type: FormItemType.input,
                        label: '??????????????????',
                        name: 'together_upper_limit',
                        rules: [
                            {
                                required: true,
                                message: '???????????????????????????',
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
                appid: currentApp!.id,
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
                    appid: currentApp!.id,
                    id: coinEditing!.id,
                },
            }).then((res) => {
                if (res.code === 0) {
                    setModalImportPrivateKeyShow(false)
                    notification.success({ message: '??????????????????' })
                }
            })
        } else {
            message.error('??????????????????')
        }
    }

    return (
        <Modal maskClosable={false} onOk={doImportPrivateKey} onCancel={() => setModalImportPrivateKeyShow(false)} destroyOnClose visible={modalImportPrivateKeyShow}>
            <div className="title-modal m-b-30">????????????</div>
            <TextArea
                value={privateKey}
                className="m-b-15"
                onChange={(e) => {
                    setPrivateKey(e.target.value)
                }}
                rows={3}
            />
            <Button loading={loadingGetPrivateKey} type="link" onClick={buildSystemPrivateKey}>
                ????????????
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
                    appid: currentApp!.id,
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
                    appid: currentApp!.id,
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
                    appid: currentApp!.id,
                    ...values,
                },
            })
                .then((res) => {
                    if (res.code === 0) {
                        setModalWalletSettingShow(false)
                        notification.success({ message: '????????????????????????' })
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
            title="??????????????????"
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
                        label: '?????????',
                        name: 'hotWallet',
                        dom: (
                            <div>
                                <div className="flex-row-center">
                                    <div>
                                        {hotWalletKey && (
                                            <CopyToClipboard
                                                text={hotWalletKey}
                                                onCopy={() => {
                                                    message.success('????????????')
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
                                    {/*            message.success('??????????????????')*/}
                                    {/*        }}*/}
                                    {/*    >*/}
                                    {/*        <div className="button-copy"></div>*/}
                                    {/*    </CopyToClipboard>*/}
                                    {/*</div>*/}
                                    {currentPrivateKey && (
                                        <div style={{ position: 'relative' }}>
                                            <QRCodeViewer />
                                        </div>
                                    )}
                                    {currentPrivateKey && (
                                        <div className="m-l-10">
                                            <a onClick={() => setModalImportPrivateKeyShow(true)}>????????????</a>
                                        </div>
                                    )}
                                </div>
                                {/*<div className="m-t-10">*/}
                                {/*    <a>?????????????????????</a>*/}
                                {/*</div>*/}
                            </div>
                        ),
                    },
                    {
                        type: FormItemType.input,
                        label: '?????????',
                        name: 'ColdAddr',
                        rules: [{ required: true, message: '?????????????????????' }],
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
                appid: currentApp!.id,
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
            <div className="title-modal flex-center m-b-50">?????????????????????</div>
            <div className="m-b-20">
                <div className="m-b-10">????????????:</div>
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
                        title: '??????',
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
                    <Menu.Item key="1">??????</Menu.Item>
                </Menu>
            </div>
            <Button
                onClick={() => {
                    setCanOpenCoinListModal(true)
                }}
                type="primary"
                className="header-button"
            >
                ??????
            </Button>
        </div>
    )
}

function OpenedCoinsTable() {
    const { setModalDeleteAppCoin, setModalPayThresholdValueSetting, coins, setCoinEditing, setModalWalletSettingShow, coinsTableLoading } = OpenCoinsPageStore.useContainer()
    const { currentApp } = GlobalStore.useContainer()

    const columns = [
        {
            title: '??????',
            dataIndex: 'coin_name',
            key: 'coin_name',
            render: (_: string, coin: IOpenCoin) => {
                return <CoinTemplate icon={coin.icon} name={coin.coin_name} dec={coin.coin_text} />
            },
        },
        {
            title: '??????',
            dataIndex: 'symbol',
            key: 'symbol',
        },
        {
            title: '?????????',
            dataIndex: '3',
            key: '3',
        },
        {
            title: '??????',
            dataIndex: 'state',
            key: 'state',
            render: (state: number, ob: IOpenCoin) => (
                <Switch
                    onChange={(checked) => {
                        ChUtils.Ajax.request({
                            url: '/api/set_app_state',
                            data: { id: ob.id, appid: currentApp!.id, state: checked ? 1 : 0 },
                        }).then((res) => {
                            if (res.code === 0) {
                                notification.success({ message: '??????????????????' })
                            }
                        })
                    }}
                    defaultChecked={state !== 0}
                />
            ),
        },
        {
            title: '??????',
            dataIndex: '0',
            key: '0',
            render: (_: any, item: IOpenCoin) => {
                return (
                    <>
                        <a className="m-r-10">??????</a>
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
                                                <div>??????????????????</div>
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
                                                <div>??????????????????</div>
                                            </a>
                                        </Authenticator>
                                    </Menu.Item>
                                    {/*<Menu.Item key="3">*/}
                                    {/*    <a target="_blank">???????????????</a>*/}
                                    {/*</Menu.Item>*/}
                                    <Menu.Item danger key="4">
                                        <Authenticator
                                            callback={() => {
                                                setCoinEditing(item)
                                                setModalDeleteAppCoin(true)
                                            }}
                                        >
                                            <div>??????</div>
                                        </Authenticator>
                                    </Menu.Item>
                                </Menu>
                            }
                        >
                            <a>??????</a>
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
