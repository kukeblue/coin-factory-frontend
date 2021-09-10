const constants = {
    rechargeTip: '应用属于免费试用期，过期后产品将不能正常使用，请及联系XX续费，以免影响运营',
}

export const AjAxPageCommonSetting = {
    buildOnAjaxBefore: function (data: Object) {
        return (req: any) => {
            return {
                url: req.url,
                data: {
                    page: req.data.pageNo,
                    limit: req.data.pageSize,
                    ...req.data.query,
                    ...data,
                },
            }
        }
    },
    onAjaxAfter: (res: any) => {
        if (res.code == 0) {
            return {
                status: res.code,
                page: {
                    total: Number(res.data.total),
                    list: res.data.list,
                    pages: Number(res.data.page),
                },
            }
        } else {
            throw new Error('请求分页发生错误')
        }
    },
}

export default constants
