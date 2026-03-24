import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { ProductDetail as ProductDetailModel, ProductPublic } from '../../core/models/product/product';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-product-modal',
  imports: [ReactiveFormsModule, CommonModule, NgClass],
  standalone:true,
  templateUrl: './product-modal.html',
  styleUrl: './product-modal.css',
})
export class ProductModal {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  @Input({required: true}) product:ProductDetailModel|null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  public isUploading = signal(false);
  public urlPreview: string | null = null;
  private selectedFile: File | null = null;
  private originalImageUrl: string | null = null;

  productForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    isPublic: [false],
    stockQuantity: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    console.log("product: ",this.product);
    this.originalImageUrl = this.product?.imageUrl || null;
    this.urlPreview = this.product?.imageUrl || null;

    this.productForm.patchValue({
      name: this.product?.name,
      description: this.product?.description,
      price: this.product?.price,
      isPublic: this.product?.isPublic,
      stockQuantity: this.product?.stockQuantity
    });
  }

  onFileSelected(file: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.toastr.error('File is not an image');
      return;
    }
    if(file.size > 1024 * 1024 * 10) {
      this.toastr.error('File is too large');
      return;
    }
    this.selectedFile = file;
    this.urlPreview = URL.createObjectURL(file);
  }

  onSubmit() {
    if (this.productForm.valid) {
      if (!this.product && !this.selectedFile) {
        this.toastr.error('Please select an image');
        return;
      }
      const formData = new FormData();
      formData.append('name', this.productForm.get('name')?.value || '');
      formData.append('description', this.productForm.get('description')?.value || '');
      formData.append('price', (this.productForm.get('price')?.value || 0).toString());
      formData.append('stockQuantity', (this.productForm.get('stockQuantity')?.value || 0).toString());
      formData.append('isPublic', (this.productForm.get('isPublic')?.value || false).toString());
      formData.append('file', this.selectedFile!);

      this.save.emit(formData);
    }
  }
}
