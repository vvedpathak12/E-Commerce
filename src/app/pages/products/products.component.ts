import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take, takeLast } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  productArr: any[] = [];
  categoryArr: any[] = [];
  selectedCategory: number = 0;
  loggedInObj: any;

  constructor(private _product: ProductService, private toastr: ToastrService, private router: Router) {
    const localData = localStorage.getItem('amazon_user');
    if (localData !== null) {
      const parseObj = JSON.parse(localData);
      this.loggedInObj = parseObj;
    }
  }

  ngOnInit(): void {
    this.getAllProduct();
    this.getAllCategory();
  }

  getAllProduct() {
    this._product.getAllProduct().subscribe((res: any) => {
      this.productArr = res.data;
    });
  }

  getAllCategory() {
    this._product.getAllCategory().subscribe((res: any) => {
      this.categoryArr = res.data.slice(0,6);
    });
  }

  getAllProductsByCategoryId(categoryId: number) {
    this.selectedCategory = categoryId;
    this._product.getAllProductsByCategoryId(categoryId).subscribe((res: any) => {
      this.productArr = res.data;
    });
  }

  addToCart(productId: number) {
    const addToCartObj = {
      "CartId": 0,
      "CustId": this.loggedInObj.custId,
      "ProductId": productId,
      "Quantity": 1,
      "AddedDate": new Date()
    }
    this._product.addToCart(addToCartObj).subscribe((res: any) => {
      if (res.result) {
        this._product.showUpdatedCart.next(true);
        this.toastr.success(res.message);
      } else {
        this.toastr.error(res.message);
      }
    }, (err: any) => {
      this.toastr.error(err.message);
    });
  }

}
