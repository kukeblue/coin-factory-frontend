import React, { useEffect, useState } from "react";
import { createContainer } from "unstated-next"
import './index.less'

function usePageStore() {
    const [count, setCount] = useState(false)
    return {
    }
}

const PageStore = createContainer(usePageStore)

function Home() {
    return <div className='home'>
       home
    </div>;
}

export default () => <PageStore.Provider><Home /></PageStore.Provider>;