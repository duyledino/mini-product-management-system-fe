import { Component } from '@angular/core';
import { ProductItem } from '../../components/product-item/product-item';

@Component({
  selector: 'app-product',
  imports: [ProductItem],
  standalone: true,
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {
  products = [
    { id: 1, name: 'Basic Tee', description: 'White organic cotton', price: 35 },
    { id: 2, name: 'Tech Jacket', description: 'Waterproof shell', price: 120 },
    { id: 3, name: 'Leather Boots', description: 'Handcrafted durability', price: 210 },
  ];  
}
