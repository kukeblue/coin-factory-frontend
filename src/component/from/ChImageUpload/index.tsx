import React, { useEffect, useState } from 'react'
import { Upload, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { RcFile, UploadFile } from 'antd/lib/upload/interface'
import './index.less'

interface ChImageUploadProps {
    onChange?: (values: string[]) => void
    value?: string[] | string
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
    const value = typeof props.value == 'string' ? [props.value] : props.value
    const [fileList, setFileList] = useState<UploadFile[]>()
    const [previewVisible, setPreviewVisible] = useState<boolean>(false)
    const [previewImage, setPreviewImage] = useState<string>()

    useEffect(() => {
        if (!fileList) return
        console.log('debug ChImageUpload onChange res: ', fileList)
        const uploadUrls: string[] = []
        fileList.forEach((item) => {
            if (item.response?.data?.FileUrl) {
                item.url = item.response.data.FileUrl
                uploadUrls.push(item.response.data.FileUrl)
            }
        })
        if ((!props.value || props.value.length === 0) && uploadUrls.length === 0) {
            return
        }
        props.onChange && props.onChange(uploadUrls)
    }, [fileList])

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
        setFileList(fileList)
    }
    const handleCancel = () => {
        setPreviewVisible(false)
    }
    const list =
        fileList ||
        (value
            ? value.map((item, index) => {
                  return {
                      uid: index + '',
                      name: index + 'image.png',
                      status: 'done',
                      url: item,
                  }
              })
            : [])

    return (
        <>
            <Upload action="/api/upload" listType="picture-card" fileList={list} onPreview={handlePreview} onChange={handleChange}>
                {(fileList && fileList.length >= 0) || (value && value.length > 0) ? null : (
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                )}
            </Upload>
            <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    )
}

export default ChImageUpload
