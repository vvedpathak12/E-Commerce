import { Component, ViewChild } from '@angular/core';
import { ProductService } from './services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecommerse';
  showPassword: boolean = false;
  registerObj: any = {
    "CustId": 0,
    "Name": "",
    "MobileNo": "",
    "Password": ""
  }
  loginObj: any = {
    "UserName": "",
    "UserPassword": ""
  }
  isApiCallInProgress: boolean = false;
  loggedInObj: any = {};
  cartItem: any[] = [];
  @ViewChild('exampleModal') exampleModal: any;

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

  closeRegisterModal() {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        document.body.removeChild(modalBackdrop);
      }
      document.body.classList.remove('modal-open');
    }
  }

  closeLoginModal() {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        document.body.removeChild(modalBackdrop);
      }
      document.body.classList.remove('modal-open');
    }
  }

  closeOffcanvas() {
    const modal = document.getElementById('offcanvasRight');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        document.body.removeChild(modalBackdrop);
      }
      document.body.classList.remove('modal-open');
    }

  }

  getCartData(id: number) {
    this._product.getAddToCartDataByCustomerId(id).subscribe((res: any) => {
      this.cartItem = res.data;
    });
  }

  onRegister() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      this._product.register(this.registerObj).subscribe((res: any) => {
        if (res.result) {
          this.isApiCallInProgress = false;
          this.loggedInObj = res.data;
          this.toastr.success(res.message);
          this.registerObj = {
            "CustId": 0,
            "Name": "",
            "MobileNo": "",
            "Password": ""
          };
          this.closeRegisterModal();
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

  onLogin() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      this._product.login(this.loginObj).subscribe((res: any) => {
        if (res.result) {
          this.isApiCallInProgress = false;
          this.loggedInObj = res.data;
          this.toastr.success(res.message);
          localStorage.setItem('amazon_user', JSON.stringify(res.data));
          this.loginObj = {
            "UserName": "",
            "UserPassword": ""
          };
          this.closeOffcanvas();
          this.getCartData(this.loggedInObj.custId);
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

  onLogOut() {
    const isConfirm = confirm('Are you sure that you wan to log out?');
    if (isConfirm) {
      localStorage.removeItem('amazon_user');
      this.loggedInObj = {};
      this.router.navigateByUrl('products');
      this.toastr.success('Logged Out Successfully');
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

  onEyeClick() {
    this.showPassword = !this.showPassword;
  }

  calculateTotalSubtotal() {
    let totalSubtotal = 0;
    // Iterate through each item in the cart and sum up the subtotal
    for (const item of this.cartItem) {
      totalSubtotal += item.productPrice; // Assuming productPrice is the property representing the price of each product
    }
    return totalSubtotal;
  }



}
