import React, { useState } from 'react'
import './index.less'
import { Modal } from 'antd'
import QRCode from 'qrcode.react'

interface QRCodeViewerProps {
    qrcodeText?: string
}

function QRCodeViewer(props: QRCodeViewerProps) {
    const [modalShow, setModalShow] = useState<boolean>(false)
    return (
        <>
            <Modal onCancel={() => setModalShow(false)} centered closeIcon={<span></span>} closable={true} maskClosable={true} width={290} footer={false} visible={modalShow}>
                <QRCode
                    id="QRCodeViewer"
                    value={props.qrcodeText || 'https://ch-ui.kukechen.top/'}
                    size={240} // 二维码的大小
                    fgColor="#000000" // 二维码的颜色
                    style={{ margin: 'auto' }}
                />
            </Modal>
            <div
                onClick={() => {
                    setModalShow(true)
                }}
                className="qrCodeViewer"
            ></div>
        </>
    )
}

export default QRCodeViewer
