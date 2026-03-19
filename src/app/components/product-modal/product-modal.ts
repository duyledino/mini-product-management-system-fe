import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ProductDetail as ProductDetailModel, ProductPublic } from '../../core/models/product/product';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-modal',
  imports: [ReactiveFormsModule],
  standalone:true,
  templateUrl: './product-modal.html',
  styleUrl: './product-modal.css',
})
export class ProductModal {
  private fb = inject(FormBuilder);
  @Input({required: true}) product:ProductDetailModel|null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  productForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    isPublic: [true],
    stockQuantity: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    this.productForm.patchValue({
      name: this.product?.name,
      description: this.product?.description,
      price: this.product?.price,
      isPublic: this.product?.public,
      stockQuantity: this.product?.stockQuantity
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      console.log("productForm: ",this.productForm.value);
      this.save.emit({
        id: this.product?.id, // ID is needed for Update, null for Create
        ...this.productForm.value
      });
    }
  }
}
