export interface ProductPublic {
    id: string;
    name: string;
    description: string;
    price: number;
    public: boolean;
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
    stockQuantity: number;
    productVersionList: ProductVersion[]
    public: boolean;
}

export interface updateProductRequest {
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
}

export interface createProductRequest{
    name: string;
    description: string;
    price: number;
    public: boolean;
}