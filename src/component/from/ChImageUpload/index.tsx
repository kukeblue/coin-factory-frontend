import React, { useEffect, useMemo, useState } from 'react'
import { Upload, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { RcFile, UploadFile } from 'antd/lib/upload/interface'
import './index.less'

interface ChImageUploadProps {
    onChange?: (values: UploadFile[]) => void
    value?: UploadFile[]
}

function getBase64(file: RcFile) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}

function ChImageUpload(props: ChImageUploadProps) {
    if (!props.value) return <div></div>
    console.log(props.value)
    const [previewVisible, setPreviewVisible] = useState<boolean>(false)
    const [previewImage, setPreviewImage] = useState<string>()
    const previewTitle = '预览'
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            // @ts-ignore
            file.preview = await getBase64(file.originFileObj!)
        }
        setPreviewImage(file.url || file.preview)
        setPreviewVisible(true)
    }
    const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
        props.onChange && props.onChange(fileList)
    }
    const handleCancel = () => {
        setPreviewVisible(false)
    }

    return (
        <>
            <Upload action="/api/upload" listType="picture-card" fileList={props.value} onPreview={handlePreview} onChange={handleChange}>
                {!props.value ||
                    (props.value.length === 0 && (
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    ))}
            </Upload>
            <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    )
}

export default ChImageUpload
