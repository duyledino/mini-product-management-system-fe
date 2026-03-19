export interface Role{
    role:string
}

export interface Profile{
    userId: string,
    username: string,
    name: string,
    avatar: string,
    age: number,
    roles: Role[],
    active: boolean
}