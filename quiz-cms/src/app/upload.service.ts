import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { finalize } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class UploadService{
    constructor(private storage: AngularFireStorage){}

   public uploadImage(image: any){
       return new Promise((resolve, reject) =>{
        const filePath = Date.now() + image.name;
        const fileRef = this.storage.ref(filePath)
        this.storage.upload(filePath, image)
        .snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe( (url: any) =>{
              const imageUrl = url.split('&token')[0];
              resolve(imageUrl);
            });
          })
        )
        .subscribe()
       })
   }
}