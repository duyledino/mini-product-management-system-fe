import { RouterModule, Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { NgModule } from '@angular/core';
import { Product } from './pages/product/product';
import { ProductDetail } from './pages/product-detail/product-detail';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { Cart } from './pages/cart/cart';
import { Admin } from './pages/admin/admin';

export const routes: Routes = [
    {
        path: '',
        component: Homepage,
        title: 'Homepage',
    },
    {
        path: 'login',
        component: Login,
        title: 'Login',
    },
    {
        path: 'register',
        component: Register,
        title: 'Register',
    },
    {
        path: 'product',
        component: Product,
        title: 'Product',
        canActivate: [authGuard]
    },
    {
        path: 'product/:id',
        component: ProductDetail,
        title: 'Product Detail',
        canActivate: [authGuard]
    },
    {
        path: 'cart',
        component: Cart,
        title: 'Cart',
        canActivate: [authGuard]
    },
    {
        path: 'admin',
        component: Admin,
        title: 'Admin Panel',
        canActivate: [authGuard, adminGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],

})
export class AppRoutingModule { }