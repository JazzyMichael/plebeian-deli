import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  @Input() post: any;
  @Input() approvedSeller: boolean;

  @Output() save: EventEmitter<any> = new EventEmitter();

  title: string;
  category: string;
  description: string = '';
  price: string = '';
  quantity: number = 1;
  images: any[] = [];
  thumbnailImgUrl: string;
  link: string = '';

  categoryOptions: string[];
  quantityOptions: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ];

  validatePrice$: Subject<any> = new Subject();

  uploading: boolean;

  constructor(
    private categoriesService: CategoriesService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.categoryOptions = this.categoriesService
      .getCategories()
      .map(cat => cat.name);

    this.validatePrice$
      .pipe(debounceTime(777))
      .subscribe(() => {
        if (this.price) {
          let chars = this.price.split('');

          chars = chars.filter(c => {
            if (
              c === '1' ||
              c === '2' ||
              c === '3' ||
              c === '4' ||
              c === '5' ||
              c === '6' ||
              c === '7' ||
              c === '8' ||
              c === '9' ||
              c === '0'
            ) {
              return true;
            } else {
              return false;
            }
          });

          this.price = chars.join('');
        }
      });

    if (this.post) {
      this.title = this.post.title;
      this.category = this.post.category;
      this.description = this.post.description;
      this.images = this.post.images;
      this.thumbnailImgUrl = this.post.thumbnailImgUrl;
      this.link = this.post.link;
      this.price = `${this.post.price}`;
      this.quantity = this.post.quantity;
    }
  }

  addImage(event: any) {
    const file = event.target.files[0];

    if (file.type.split('/')[0] !== 'image') {
      window.alert('Only Image files are allowed');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.images.push({ file, url: e.target.result });
      if (this.images.length === 1) {
        this.thumbnailImgUrl = this.images[0].url;
      }
    };

    reader.readAsDataURL(file);
  }

  removeImage(index: number) {
    let flag: boolean;

    if (this.thumbnailImgUrl === this.images[index].url) {
      flag = true;
    }

    this.images.splice(index, 1);

    if (flag) {
      this.thumbnailImgUrl = this.images.length ? this.images[0].url : null;
    }
  }

  setThumbnail(imgUrl: string) {
    this.thumbnailImgUrl = imgUrl;
  }

  priceInput() {
    this.validatePrice$.next();
  }

  async submit() {

    this.uploading = true;

    const postImages = [];

    const thumbnailIndex = this.images.findIndex(i => i.url === this.thumbnailImgUrl);

    console.log('thumb index', thumbnailIndex);

    for await (let img of this.images) {

      if (!img.file && img.url) {
        console.log('just url', img);
        postImages.push(img);
      } else {
        console.log('uploading img', img);
        const random = Math.random().toString().slice(0, 8);

        const fileType = img.file.type.split('/')[1];

        const path = `deli-pictures/${random}`;

        const ref = this.storage.ref(path);

        await this.storage.upload(path, img.file);

        const url = await ref.getDownloadURL().toPromise();

        const thumbPath = `deli-pictures/thumbnails/0_500x500.${random.substring(2)}`;

        postImages.push({ url, thumbPath });
      }
    }

    const post = {
      title: this.title,
      category: this.category,
      description: this.description,
      images: postImages,
      thumbnailPath: postImages[thumbnailIndex].thumbPath,
      thumbnailImgUrl: postImages[thumbnailIndex].url,
      link: this.link,
      price: this.approvedSeller && this.price ? parseInt(this.price) : 0,
      quantity: this.approvedSeller && this.quantity ? this.quantity : 0,
      startingQuantity: this.approvedSeller && this.quantity ? this.quantity : 0,
      likes: 0
    };

    this.uploading = false;

    this.save.emit(post);
  }

}
