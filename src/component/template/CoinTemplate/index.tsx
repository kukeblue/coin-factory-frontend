import React, { useState } from 'react'
import './index.less'
function CoinTemplate(props: { icon?: string; name?: string; dec?: string }) {
    const [hideImg, setHideImg] = useState(false)
    return (
        <div className="flex-row-center">
            {props.icon && !hideImg ? (
                <img
                    onError={(e) => {
                        setHideImg(true)
                    }}
                    src={props.icon}
                    className="coin-pic m-r-10"
                />
            ) : (
                <div className="coin-pic m-r-10" />
            )}
            <div>
                <div className="coin-name-en">{props.name}</div>
                <div className="coin-name">{props.dec}</div>
            </div>
        </div>
    )
}

export default CoinTemplate
