import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  loggedInObj: any = {};
  cartItem: any[] = [];
  placeOrderObj: any = {
    "SaleId": 0,
    "CustId": 0,
    "SaleDate": new Date(),
    "TotalInvoiceAmount": 0,
    "Discount": 0,
    "PaymentNaration": "",
    "DeliveryAddress1": "",
    "DeliveryAddress2": "",
    "DeliveryCity": "",
    "DeliveryPinCode": "",
    "DeliveryLandMark": ""
  };
  isApiCallInProgress: boolean = false;

  constructor(private _product: ProductService, private toastr: ToastrService, private router: Router) {
    const localData = localStorage.getItem('amazon_user');
    if (localData !== null) {
      const parseObj = JSON.parse(localData);
      this.loggedInObj = parseObj;
      this.getCartData(this.loggedInObj.custId);
    }

    this._product.showUpdatedCart.subscribe((res: boolean) => {
      if (res) {
        this.getCartData(this.loggedInObj.custId);
      }
    });
  }

  ngOnInit(): void {
  }

  getCartData(id: number) {
    this._product.getAddToCartDataByCustomerId(id).subscribe((res: any) => {
      this.cartItem = res.data;
    });
  }

  calculateTotalSubtotal() {
    let totalSubtotal = 0;
    for (const item of this.cartItem) {
      totalSubtotal += item.productPrice;
    }
    return totalSubtotal;
  }

  placeCartOrder() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      this.placeOrderObj.CustId = this.loggedInObj.custId;
      this.placeOrderObj.TotalInvoiceAmount = this.calculateTotalSubtotal();
      this._product.placeOrder(this.placeOrderObj).subscribe((res: any) => {
        if (res.result) {
          this.isApiCallInProgress = false;
          this.toastr.success(res.message);
          this._product.showUpdatedCart.next(true);
          this.placeOrderObj = {
            "SaleId": 0,
            "CustId": 0,
            "SaleDate": new Date(),
            "TotalInvoiceAmount": 0,
            "Discount": 0,
            "PaymentNaration": "",
            "DeliveryAddress1": "",
            "DeliveryAddress2": "",
            "DeliveryCity": "",
            "DeliveryPinCode": "",
            "DeliveryLandMark": ""
          };
          this.router.navigateByUrl('products');
        } else {
          this.isApiCallInProgress = false;
          this.toastr.error(res.message);
        }
      }, (err: any) => {
        this.isApiCallInProgress = false;
        this.toastr.error(err.message);
      });
    }

  }

  deleteProductFromCartById(cartId: number) {
    this._product.deleteProductFromCartById(cartId).subscribe((res: any) => {
      if (res.result) {
        this.cartItem = res.data;
        this.toastr.success(res.message);
        this.getCartData(this.loggedInObj.custId);
        this._product.showUpdatedCart.next(true);
      }
    });
  }

}
