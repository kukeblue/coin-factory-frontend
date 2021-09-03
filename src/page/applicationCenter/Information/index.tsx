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
import VerificationModal from '../../../component/modal/VerificationModal'

const { confirm } = Modal

function useInformationFormPageStore() {
    const [formRef] = useForm()
    const [appInfo, setAppInfo] = useState<IAppInfo>()
    const { currentApp } = GlobalStore.useContainer()
    useEffect(() => {
        if (!currentApp) {
            confirm({
                title: '友情提示',
                content: '当前未选择应用，请先去切换应用或者创建新应用',
                okText: '确定',
                cancelText: '取消',
                onOk() {},
                onCancel() {},
            })
            return
        }

        ChUtils.Ajax.request({
            url: '/api/get_app_info',
            data: {
                appid: currentApp.id,
            },
            method: 'post',
        }).then((res) => {
            if (res.code === 0 && res.data) {
                setAppInfo(res.data)
                formRef.setFieldsValue(res.data)
            }
        })
    }, [currentApp, formRef])
    return {
        appInfo,
        formRef,
    }
}

const InformationFormPageStore = createContainer(useInformationFormPageStore)

function AppKeyChanger() {
    const { appInfo } = InformationFormPageStore.useContainer()
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
            <VerificationModal />
            <div>{appInfo?.appkey || '未设置'}</div>
            <CopyToClipboard text={appInfo?.appkey || ''} onCopy={onCopy}>
                <div className="copy-button"></div>
            </CopyToClipboard>
            <div className="information-update">更改</div>
        </div>
    )
}

function AppSecretChanger() {
    const { appInfo } = InformationFormPageStore.useContainer()
    return (
        <div className="flex-row-center">
            <Tag>查看密钥</Tag>
            <div className="information-update m-l-20">更改</div>
        </div>
    )
}

function InformationForm() {
    const { formRef } = InformationFormPageStore.useContainer()
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
                        name: 'appkey',
                        label: 'AppKey',
                        dom: <AppKeyChanger />,
                    },
                    {
                        type: FormItemType.other,
                        name: 'secret',
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
                        dom: <div>应用图标</div>,
                    },
                    {
                        type: FormItemType.other,
                        name: 'state',
                        label: '是否开启',
                        dom: <Switch />,
                    },
                    {
                        type: FormItemType.other,
                        name: 'allows_ip',
                        label: 'IP白名单',
                        dom: <TextArea />,
                    },
                ]}
            />
            <div className="m-t-50" style={{ marginLeft: 165 }}>
                <Button type="primary">保存设置</Button>
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
            </div>
        </div>
    )
}

export default () => (
    <InformationFormPageStore.Provider>
        <Information />
    </InformationFormPageStore.Provider>
)
