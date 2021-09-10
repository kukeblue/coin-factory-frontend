import { useEffect, useRef, useState, useCallback } from 'react'
import { ChUtils } from 'ch-ui'

const Ajax = ChUtils.Ajax

//@type Hook Function 分页Hoos,TS版本
export interface PageResponse<T> {
    status: number
    page: {
        total: number
        list: T[]
        pages: number
    }
}

export interface PageRequest {
    url: string
    data: { query: Object; pageNo: number; pageSize: number }
}

export interface usePageProps {
    url: string
    pageSize: number
    query: Object
    onReloadAfter?: (res: any) => void
    onAjaxBefore?: (req: PageRequest) => { url: string; data: any }
    onAjaxAfter?: <T>(res: any) => PageResponse<T>
    isInitFetch?: boolean
}

const defaultUsePageProps = {
    url: '',
    pageSize: 0,
    query: {},
    isInitFetch: true,
}

export interface PageRes<T> {
    status: number
    page?: {
        total: number
        list: T[]
        pages: number
    }
}

export function usePage<T>(props: usePageProps = defaultUsePageProps) {
    const [query, setQuery] = useState<any>(props.query)
    const [status, setStatus] = useState<string>('more')
    const [total, setTotal] = useState<number>(0)
    const [list, setList] = useState<T[]>([])

    const ref = useRef({ pageNo: 1 })
    const reload = async (pageNo?: number, newQuery?: any) => {
        const { onReloadAfter, pageSize, url, onAjaxBefore } = props
        setStatus('loading')
        if (!pageNo) pageNo = 1
        ref.current.pageNo = pageNo
        const pz = pageSize || 10
        let requestPrams: PageRequest = {
            url,
            data: {
                query: newQuery || query,
                pageNo,
                pageSize: pz,
            },
        }
        if (props.onAjaxBefore) {
            requestPrams = props.onAjaxBefore(requestPrams)
            requestPrams.data = {
                ...requestPrams.data,
            }
        }
        if (newQuery) {
            setQuery(newQuery)
        }
        let resp = await Ajax.request(requestPrams)
        if (resp && props.onAjaxAfter) {
            resp = props.onAjaxAfter(resp)
        }
        console.log('分页PAGE获取成功', query, resp)
        if (resp.status === 0 && resp.page) {
            setTotal(resp.page.total)
            let newList: T[]
            if (pageNo === 1) {
                newList = resp.page.list
            } else {
                newList = [...list].concat(resp.page.list.filter((x: any) => (list.find((y: any) => y.id === x.id) ? false : true)))
            }
            setList(newList)
            ref.current.pageNo = pageNo + 1
            if (resp.page.pages < pz) {
                setStatus('noMore')
            } else {
                setStatus('more')
            }
        } else {
            setStatus('noMore')
        }
        onReloadAfter && onReloadAfter(resp)
    }

    useEffect(() => {
        props.isInitFetch && reload()
    }, [])

    const loadMore = async () => {
        if (status === 'noMore') return
        await reload(ref.current.pageNo)
    }
    return {
        list,
        setList,
        status,
        setStatus,
        reload,
        loadMore,
        total,
        setQuery,
    }
}

interface useOptionFormListHookProps {
    url: string
    query?: Object
    labelKey?: string
    valueKey?: string
    onAjaxAfter?: (res: any) => { status: number; list: any[] }
}

const defaultOptionFormListHookProps: useOptionFormListHookProps = {
    url: '',
    labelKey: 'name',
    valueKey: 'id',
}

interface Options {
    label: string
    value: string
}

export function useOptionFormListHook2(props: useOptionFormListHookProps) {
    const { url, query = {} } = props
    const [list, setList] = useState([])
    const [optionsMap, setOptionsMap] = useState<any>({})
    const [options, setOptions] = useState<Options[]>([])
    useEffect(() => {
        Ajax.request({ url, data: query }).then((res: any) => {
            const data = props.onAjaxAfter ? props.onAjaxAfter(res) : res
            if (data.status == 0 && data.list) {
                refresh(data)
            }
        })
    }, [])

    const refresh = (res: any) => {
        let newOptions: Options[] = []
        let newOptionsMap: any = {}
        res.list.forEach((item: any) => {
            newOptionsMap[item[props.labelKey!]] = item
            newOptions.push({
                label: item[props.labelKey || defaultOptionFormListHookProps.labelKey!],
                value: item[props.valueKey || defaultOptionFormListHookProps.valueKey!],
            })
        })
        setList(res.list)
        setOptionsMap(newOptionsMap)
        setOptions(newOptions)
    }
    return {
        list,
        optionsMap,
        options,
    }
}

export function useOptionFormListHook(props: useOptionFormListHookProps) {
    const { url, query = '' } = props
    const [list, setList] = useState([])
    const [optionsMap, setOptionsMap] = useState<any>({})
    const [options, setOptions] = useState<Options[]>([])
    useEffect(() => {
        Ajax.request({ url, data: { query } }).then((res: any) => {
            if (res.status == 0 && res.list) {
                refresh(res)
            }
        })
    }, [query, url])

    const refresh = (res: any) => {
        let newOptions: Options[] = []
        let newOptionsMap: any = {}
        res.list.forEach((item: any) => {
            newOptionsMap[item.id] = item
            newOptions.push({
                label: item.name,
                value: item.id,
            })
        })
        setList(res.list)
        setOptionsMap(newOptionsMap)
        setOptions(newOptions)
    }
    return {
        list,
        optionsMap,
        options,
    }
}

function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback)
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])
    useEffect(() => {
        if (delay === null) {
            return
        }
        const id = setInterval(() => savedCallback.current(), delay)
        return () => clearInterval(id)
    }, [delay])
}

const chHooks = {
    usePage,
    useOptionFormListHook,
    useOptionFormListHook2,
    useInterval,
}

export default chHooks
