import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environments } from '../environments/environments';
import { tap } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryApi {
  private http = inject(HttpClient);
  private cloudinaryUrl = `https://api.cloudinary.com/v1_1/${environments.cloudinary.cloudName}/image`;

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environments.cloudinary.uploadPreset);
    formData.append('folder', environments.cloudinary.folder);
    return this.http.post(this.cloudinaryUrl+"/upload", formData).pipe(
      tap((response: any) => {console.log(response.secure_url);}
    ,
    (error: any) => {console.log(error);}
  )
    );
  }

  destroyImage(publicId: string) {
    const config = environments.cloudinary;
  const timestamp = Math.round((new Date()).getTime() / 1000).toString();
  

  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${config.apiSecret}`;

  const signature = CryptoJS.SHA1(stringToSign).toString();

  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp);
  formData.append('api_key', config.apiKey);

  const url = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/destroy`;

  return this.http.post(url, formData);
  }
}
