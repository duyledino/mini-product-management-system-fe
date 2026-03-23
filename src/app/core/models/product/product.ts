export interface ProductPublic {
    id: string;
    name: string;
    description: string;
    price: number;
    public: boolean;
    imageUrl:string;

}

export interface ProductVersion {
    currentVersion: number;
    name: string;
    price: number;
}

export interface ProductDetail {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    price: number;
    imageUrl:string;
    stockQuantity: number;
    productVersionList: ProductVersion[]
    public: boolean;
}

export interface updateProductRequest {
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl:string;
}

export interface createProductRequest{
    name: string;
    description: string;
    price: number;
    isPublic: boolean;
    stockQuantity: number;
    imageUrl:string;
}

export interface adminProductVersion{
    versionNumber: number;
    name: string;
    description: string;
    price: number;
    createdAt: Date;
}

export interface adminProduct{
    id: string;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    public: boolean;
    isDeleted: boolean;
    ownerId: string;
    currentVersion: number;
    productVersions: ProductVersion[];
    imageUrl:string;

    createdAt: Date;

    updatedAt: Date;
}

export interface CreateVersionRequest {
    name: string;
    description: string;
    price: number;
}