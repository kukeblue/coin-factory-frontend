import React from "react";
import './index.less'

function Layout({children}: {children: JSX.Element}) {
    return <div className='layout'>
        {children}
    </div>
}

export default Layout