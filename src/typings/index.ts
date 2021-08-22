export interface User {
    id?: number,
    name?: string,
    avatarUrl?: string,
    token: string,
    ttlInSec?: number,
    isAdmin?: boolean,
    corporation?: {
        name: string,
        fullName: string,
        roundLogoUrl: string,
        squareLogoUrl: string
    }
}

export interface IQrCodeGroup {
    id: number,
    name: string,
}

export interface IContactQrCode {
    id: number,
    name: string,
    group: IQrCodeGroup,
    employees: IEmployee[]
}

export interface IEmployee {
    id: number,
    name: string,
    avatarUrl: string
}

export interface ILabel {
    id: number
    name: string,
    group?: {
        id: number,
        name: string,
    }
}
export interface ILabelGroup {
    id: number,
    labels?: ILabel[],
    name: string
}


