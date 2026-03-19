import { Component, inject, Input, OnInit } from '@angular/core';
import { ProductPublic } from '../../core/models/product/product';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-item',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './product-item.html',
  styleUrl: './product-item.css',
})
export class ProductItem {
  
  @Input({required: true}) product!: ProductPublic;
}
