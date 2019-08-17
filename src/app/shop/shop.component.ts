import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  products: any[];

  constructor() { }

  ngOnInit() {
    this.products = [
      {
        name: 'Loyalty Club Black T-shirt',
        price: 22,
        description: 'Limited run Loyalty Club shirt in Black Short Sleeve for the early bird supporter.',
        material: 'Gildan Ultra T',
        sizes: ['Small', 'Medium', 'Large'],
        images: ['assets/images/tshirt.webp'],
        inStock: false
      },
      {
        name: 'Loyalty Club White Long Sleeve Shirt',
        price: 28,
        description: 'Limited run Loyalty Club shirt in White Long Sleeve for the early bird supporter.',
        material: 'Gildan Ultra T',
        sizes: ['Small', 'Medium', 'Large'],
        images: ['assets/images/longsleeve-front.webp'],
        inStock: false
      },
      {
        name: 'Plebeian Sticker Pack',
        price: 5,
        description: 'Recieve 3 fun stickers to adorn your, laptop, car, face; pretty much any surface in your life with. Express to the world your admiration for Plebeian and your early knoweldge of the new art world to come!',
        material: '',
        maxQuantity: 10,
        images: ['assets/images/stickers.webp'],
        inStock: true
      }
    ];
  }

}
