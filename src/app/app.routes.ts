import { RouterModule, Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { NgModule } from '@angular/core';
import { Product } from './pages/product/product';

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
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }