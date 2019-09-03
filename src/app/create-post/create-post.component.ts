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

  img = {
    url: '',
    ref: ''
  };

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
    for await (let img of this.images) {

      const random = Math.random().toString().slice(0, 10);

      const path = `deli-pictures/${random}`;

      const ref = this.storage.ref(path);

      this.storage.upload(path, img.file)
        .then(async () => {
          const url = await ref.getDownloadURL().toPromise();

          img = { url };

          console.log('upload done');
        })
        .catch(e => console.log('error uploading image', e));

      console.log('loop done');
    }


    const post = {
      title: this.title,
      category: this.category,
      description: this.description,
      images: this.images,
      thumbnailImgUrl: this.thumbnailImgUrl,
      link: this.link,
      price: this.approvedSeller && this.price ? parseInt(this.price) : 0,
      quantity: this.approvedSeller && this.quantity ? this.quantity : 0,
      startingQuantity: this.approvedSeller && this.quantity ? this.quantity : 0,
      createdTimestamp: new Date(),
      likes: 0
    };

    this.save.emit(post);
  }

}
