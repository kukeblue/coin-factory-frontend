import React from 'react'

function CoinTemplate(props: { icon?: string; name?: string; dec?: string }) {
    return (
        <div className="flex-row-center">
            {props.icon ? <img src={props.icon} className="coin-pic m-r-10"></img> : <div className="coin-pic m-r-10"></div>}
            <div>
                <div className="coin-name-en">{props.name}</div>
                <div className="coin-name">{props.dec}</div>
            </div>
        </div>
    )
}

export default CoinTemplate
