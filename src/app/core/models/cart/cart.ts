export interface Cart{
    cartId: string;
    userId: string;
    items: CartItem[];
    totalAmount: number;
}

export interface CartItem{
    productId: string;
    cartItemId: string;
    productName: string;
    quantity: number;
    price: number;
    totalPrice: number;
    public: boolean;
}