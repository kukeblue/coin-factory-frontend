import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'antd'
import { useHistory } from 'react-router-dom'
import { GlobalStore } from '../../../store/globalStore'

interface HasAppCheckProps {
    children: JSX.Element
}

export default function HasAppCheck(props: HasAppCheckProps) {
    const [show, setShow] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setShow(true)
        }, 1500)
    }, [])
    const history = useHistory()
    const { currentApp } = GlobalStore.useContainer()
    return (
        <>
            {show && (
                <Modal footer={false} okText="去应用中心" visible={currentApp && currentApp.id ? false : true}>
                    <div className="title-modal">提示</div>
                    <div className="m-t-20">检查到当前未选择应用，请先选择应用或创建应用</div>
                    <div className="m-t-20 m-b-50">
                        <Button
                            onClick={() => {
                                history.push('/application')
                            }}
                            type="primary"
                            style={{ float: 'right' }}
                        >
                            去选择应用
                        </Button>
                    </div>
                </Modal>
            )}
            {props.children}
        </>
    )
}
