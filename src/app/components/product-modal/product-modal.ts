import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { ProductDetail as ProductDetailModel, ProductPublic } from '../../core/models/product/product';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CloudinaryApi } from '../../core/services/cloudinary-api';
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
  private cloudinaryApi = inject(CloudinaryApi);
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
    public: [false],
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
      public: this.product?.public,
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

  private extractPublicId(url: string): string {
    const parts = url.split('/');
    const lastPart = parts.pop() || '';
    const folder = parts.pop() || '';
    const filename = lastPart.split('.')[0];
    return `${folder}/${filename}`;
  }

  onSubmit() {
    if (this.productForm.valid) {
      if (this.selectedFile) {
        this.isUploading.set(true);

        const uploadNewImage = () => {
          this.cloudinaryApi.uploadImage(this.selectedFile!).subscribe({
            next: (response: any) => {
              this.isUploading.set(false);
              this.emitSave(response.secure_url);
            },
            error: (error) => {
              this.isUploading.set(false);
              this.toastr.error('Failed to upload image. Form not saved.');
            }
          });
        };

        // If updating an existing product that already had a Cloudinary image, destroy it natively first.
        if (this.product && this.originalImageUrl && this.originalImageUrl.includes('cloudinary.com')) {
          const oldPublicId = this.extractPublicId(this.originalImageUrl);
          this.cloudinaryApi.destroyImage(oldPublicId).subscribe({
            next: () => uploadNewImage(),
            error: (err) => {
              console.log('Error destroying old image', err);
              // continue uploading even if destroy fails, to not block the user
              uploadNewImage();
            }
          });
        } else {
          // No previous image to destroy
          uploadNewImage();
        }
      } else {
        // No new file Selected. Just use the original image URL.
        this.emitSave(this.originalImageUrl || '');
      }
    }
  }

  private emitSave(finalImageUrl: string) {
    this.save.emit({
      id: this.product?.id,
      imageUrl: finalImageUrl,
      ...this.productForm.value
    });
  }
}
