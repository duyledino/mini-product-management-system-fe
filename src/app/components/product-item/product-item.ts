import { Component, inject, Input, OnInit } from '@angular/core';
import { Product } from '../../core/services/product-api';
import { ProductPublic } from '../../core/models/product/product';

@Component({
  selector: 'app-product-item',
  imports: [],
  standalone: true,
  templateUrl: './product-item.html',
  styleUrl: './product-item.css',
})
export class ProductItem {
  @Input({required: true}) product!: ProductPublic;
}
