import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import { ChUtils } from 'ch-ui'
const chCache = ChUtils.chCache

function useGlobalStore() {
    const [currentApp, setCurrentApp] = useState<IApplication>(chCache.getObCache('currentApp'))

    useEffect(() => {
        if (!currentApp) return
        chCache.setObCache('currentApp', currentApp)
    }, [currentApp])

    return {
        currentApp,
        setCurrentApp,
    }
}

export const GlobalStore = createContainer(useGlobalStore)
