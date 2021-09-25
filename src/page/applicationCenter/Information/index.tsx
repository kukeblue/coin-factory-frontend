import React, { useEffect, useState } from 'react'
import './index.less'
import { ChForm, ChUtils, FormItemType } from 'ch-ui'
import { GlobalStore } from '../../../store/globalStore'
import { createContainer } from 'unstated-next'
import { IAppInfo } from '../interface'
import { useForm } from 'antd/lib/form/Form'
import { Switch, Tag, Modal, Button, message } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Authenticator from '../../../component/auth/Authenticator'
import { IAuthParams } from '../../../typings'
import AjaxBuilderInput from '../../../component/from/AjaxBuilderInput'
import ChImageUpload from '../../../component/from/ChImageUpload'
import { notification } from 'antd/es'
import { CopyOutlined } from '@ant-design/icons'
import { getImageNameFromUrl } from '../../../utils/format'

const { confirm } = Modal

function useInformationFormPageStore() {
    const [formRef] = useForm()
    const [appInfo, setAppInfo] = useState<IAppInfo>()
    const [modalSetAppKeyShow, setModalSetAppKeyShow] = useState(false)
    const [modalSetAppSecretShow, setModalSetAppSecretShow] = useState(false)
    const [authParams, setAuthParams] = useState<IAuthParams | undefined>()
    const { currentApp } = GlobalStore.useContainer()
    useEffect(() => {
        getAppInfo()
    }, [currentApp])

    const getAppInfo = () => {
        ChUtils.Ajax.request({
            url: '/api/get_app_info',
            data: {
                appid: currentApp!.id,
            },
            method: 'post',
        }).then((res) => {
            if (res.code === 0 && res.data) {
                setAppInfo(res.data)
            }
        })
    }

    return {
        appInfo,
        formRef,
        modalSetAppKeyShow,
        setModalSetAppKeyShow,
        modalSetAppSecretShow,
        setModalSetAppSecretShow,
        authParams,
        setAuthParams,
        getAppInfo,
    }
}

const InformationFormPageStore = createContainer(useInformationFormPageStore)

function ModalSetAppKey() {
    const { setModalSetAppKeyShow, modalSetAppKeyShow, getAppInfo, appInfo } = InformationFormPageStore.useContainer()
    const { currentApp } = GlobalStore.useContainer()
    const [formRef] = useForm()
    const buildAppKey = async () => {
        const res = await ChUtils.Ajax.request({
            url: 'api/get_appkey',
        })
        if (res.code === 0) {
            return res.data
        }
        throw new Error('生成AppKey失败，请重试')
    }
    const submit = () => {
        if (!currentApp) return
        formRef.validateFields().then((res) => {
            if (res.appkey && res.appkey !== '') {
                ChUtils.Ajax.request({
                    url: '/api/set_appkey',
                    data: {
                        appkey: res.appkey,
                        appid: currentApp.id,
                    },
                }).then((res1) => {
                    if (res1.code === 0) {
                        getAppInfo()
                        setModalSetAppKeyShow(false)
                    }
                })
            } else {
                setModalSetAppKeyShow(false)
            }
        })
    }

    return (
        <Modal
            destroyOnClose={true}
            onOk={submit}
            onCancel={() => {
                setModalSetAppKeyShow(false)
            }}
            title="生成新的AppKey"
            visible={modalSetAppKeyShow}
        >
            <ChForm
                form={formRef}
                layout={{
                    labelCol: { span: 5 },
                    wrapperCol: { span: 17 },
                }}
                formData={[
                    {
                        type: FormItemType.other,
                        label: 'AppKey',
                        name: 'appkey',
                        dom: <AjaxBuilderInput defaultValue="" ajaxGetValue={buildAppKey} />,
                        rules: [
                            {
                                required: true,
                                message: 'AppKey不能为空！',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (appInfo?.appkey === value) {
                                        return Promise.reject(new Error('AppKey没有变化'))
                                    }
                                    return Promise.resolve()
                                },
                            }),
                        ],
                    },
                ]}
            />
        </Modal>
    )
}

function ModalSetAppSecret() {
    const { setModalSetAppSecretShow, modalSetAppSecretShow, getAppInfo } = InformationFormPageStore.useContainer()
    const { currentApp } = GlobalStore.useContainer()
    const [formRef] = useForm()
    const buildAppSecret = async () => {
        const res = await ChUtils.Ajax.request({
            url: 'api/get_sercet',
        })
        if (res.code === 0) {
            return res.data
        }
        throw new Error('生成AppKey失败，请重试')
    }
    const submit = () => {
        if (!currentApp) return
        formRef.validateFields().then((res) => {
            if (!res.appsercet || res.appsercet === '') {
                message.error('App Secret不能为空')
                return
            }
            ChUtils.Ajax.request({
                url: '/api/set_sercet',
                data: {
                    appsercet: res.appsercet,
                    appid: currentApp.id,
                },
            }).then((res1) => {
                if (res1.code === 0) {
                    notification.success({ message: 'App Secret 更新成功' })
                    getAppInfo()
                    setModalSetAppSecretShow(false)
                }
            })
        })
    }

    return (
        <Modal
            destroyOnClose={true}
            onOk={submit}
            onCancel={() => {
                setModalSetAppSecretShow(false)
            }}
            title="更改AppSecret"
            visible={modalSetAppSecretShow}
        >
            <ChForm
                form={formRef}
                layout={{
                    labelCol: { span: 5 },
                    wrapperCol: { span: 17 },
                }}
                formData={[
                    {
                        type: FormItemType.other,
                        label: 'App Sercet',
                        name: 'appsercet',
                        dom: <AjaxBuilderInput defaultValue="" ajaxGetValue={buildAppSecret} />,
                        rules: [
                            {
                                required: true,
                                message: 'AppKey不能为空！',
                            },
                        ],
                    },
                ]}
            />
        </Modal>
    )
}

function AppKeyChanger() {
    const { appInfo, setModalSetAppKeyShow } = InformationFormPageStore.useContainer()
    const onCopy = () => {
        if (appInfo?.appkey) {
            message.success('复制成功')
        } else {
            message.error('appkey未设置')
            return
        }
    }
    return (
        <div className="flex-row-center">
            <div style={{ fontFamily: 'PlusJakartaSans-ExtraBold' }}>{appInfo?.appkey || '未设置'}</div>
            <CopyToClipboard text={appInfo?.appkey || ''} onCopy={onCopy}>
                <div className="button-copy">
                    <CopyOutlined />
                </div>
            </CopyToClipboard>
            <Authenticator
                callback={(v) => {
                    setModalSetAppKeyShow(true)
                }}
            >
                <div className="information-update">{appInfo?.appkey ? '更改' : '生成'}</div>
            </Authenticator>
        </div>
    )
}

function AppSecretChanger() {
    const { currentApp } = GlobalStore.useContainer()
    const { setModalSetAppSecretShow } = InformationFormPageStore.useContainer()
    const viewSecret = () => {
        ChUtils.Ajax.request({
            url: '/api/show_sercet',
            data: {
                appid: currentApp!.id,
            },
        }).then((res) => {
            if (res.code === 0 && res.data === '') {
                Modal.success({
                    okText: '关闭',
                    content: (
                        <GlobalStore.Provider>
                            <div className="flex-row-center">
                                AppSecret为空,请点击
                                <Authenticator
                                    callback={() => {
                                        Modal.destroyAll()
                                        setModalSetAppSecretShow(true)
                                    }}
                                >
                                    <div style={{ textDecoration: 'underline' }} className="information-update">
                                        生成
                                    </div>
                                </Authenticator>
                            </div>
                        </GlobalStore.Provider>
                    ),
                    icon: false,
                })
            }
            if (res.code === 0 && res.data !== '') {
                Modal.success({
                    okText: '关闭',
                    content: (
                        <div>
                            <span className="m-r-10">{res.data}</span>
                            <CopyToClipboard text={res.data} onCopy={() => message.success('拷贝成功')}>
                                <CopyOutlined />
                            </CopyToClipboard>
                        </div>
                    ),
                    icon: false,
                })
            }
        })
    }
    return (
        <div className="flex-row-center">
            <Authenticator callback={viewSecret}>
                <Tag style={{ cursor: 'pointer' }}>查看密钥</Tag>
            </Authenticator>
            <Authenticator
                callback={() => {
                    setModalSetAppSecretShow(true)
                }}
            >
                <div className="information-update m-l-20">更改</div>
            </Authenticator>
        </div>
    )
}

function InformationForm() {
    const { appInfo } = InformationFormPageStore.useContainer()
    const { formRef } = InformationFormPageStore.useContainer()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!appInfo) return
        if (appInfo && appInfo.state === 0) {
            appInfo!.state = false
        } else if (appInfo && appInfo.state === 1) {
            appInfo!.state = true
        }
        formRef.setFieldsValue({
            ...appInfo,
            logo: appInfo?.logo
                ? [
                      {
                          uid: -1,
                          name: '',
                          status: 'done',
                          url: appInfo?.logo,
                      },
                  ]
                : [],
        })
    }, [appInfo])

    const submit = () => {
        formRef.validateFields().then((values) => {
            setLoading(true)
            if (values && !values.state) {
                values!.state = 0
            } else if (values && values.state) {
                values!.state = 1
            }
            ChUtils.Ajax.request({
                url: '/api/set_app',
                data: {
                    appname: values.app_name,
                    state: values.state,
                    logo: values.logo[0].response && values.logo[0].response.data.File ? values.logo[0].response.data.File : appInfo?.logo ? getImageNameFromUrl(appInfo.logo) : undefined,
                    allowsip: values.allows_ip,
                    appid: appInfo!.id,
                },
            })
                .then((res) => {
                    if (res.code === 0) {
                        notification.success({ message: '保存成功' })
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
        })
    }
    return (
        <div>
            <ChForm
                form={formRef}
                layout={{
                    labelCol: { span: 4 },
                    wrapperCol: { offset: 1, span: 14 },
                }}
                formData={[
                    {
                        type: FormItemType.other,
                        name: 'appKey',
                        label: 'AppKey',
                        dom: <AppKeyChanger />,
                    },
                    {
                        type: FormItemType.other,
                        name: 'appSecret',
                        label: 'App Secret',
                        dom: <AppSecretChanger />,
                    },
                    {
                        type: FormItemType.input,
                        name: 'app_name',
                        label: '应用名称',
                        rules: [{ required: true, message: '请输入应用名称' }],
                    },
                    {
                        type: FormItemType.other,
                        name: 'logo',
                        label: 'Logo',
                        dom: <ChImageUpload />,
                    },
                    // {
                    //     type: FormItemType.other,
                    //     name: 'state',
                    //     label: '是否开启',
                    //     valuePropName: 'checked',
                    //     dom: <Switch />,
                    // },
                    {
                        type: FormItemType.other,
                        name: 'allows_ip',
                        label: 'IP白名单',
                        dom: <TextArea />,
                    },
                ]}
            />
            <div className="m-t-50" style={{ marginLeft: 165 }}>
                <Button onClick={submit} loading={loading} type="primary">
                    保存设置
                </Button>
            </div>
        </div>
    )
}

function Information() {
    return (
        <div>
            <div className="information-header">
                <h2>应用信息</h2>
            </div>
            <div className="information-content">
                <InformationForm />
                <ModalSetAppKey />
                <ModalSetAppSecret />
            </div>
        </div>
    )
}

export default () => (
    <InformationFormPageStore.Provider>
        <Information />
    </InformationFormPageStore.Provider>
)
