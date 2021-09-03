import App from './App'
import ReactDOM from 'react-dom'
import { ChUtils } from 'ch-ui'
import { message } from 'antd'
import qs from 'query-string'
import { GlobalStore } from './store/globalStore'

const init = () => {
    const Ajax = ChUtils.Ajax
    Ajax.RequestConfig.onResponse = (data) => {
        if (data.code && data.code === -1) {
            message.error(data.msg)
        }
    }
    Ajax.RequestConfig.config = {
        withCredentials: true,
        // crossDomain:true,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }
    Ajax.RequestConfig.onRequest = (data: any) => {
        Object.keys(data).forEach((key) => {
            if (data[key] === undefined || data[key] === null) {
                delete data[key]
            }
        })
        return qs.stringify(data)
    }
}

init()

ReactDOM.render(App, document.getElementById('root'))
