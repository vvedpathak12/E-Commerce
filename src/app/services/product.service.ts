import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  showUpdatedCart: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  getAllProduct(): Observable<any[]> {
    return this.http.get<any[]>('https://freeapi.miniprojectideas.com/api/amazon/GetAllProducts');
  }

  getAllCategory(): Observable<any[]> {
    return this.http.get<any[]>('https://freeapi.miniprojectideas.com/api/amazon/GetAllCategory');
  }

  getAllProductsByCategoryId(id: number): Observable<any[]> {
    return this.http.get<any[]>('https://freeapi.miniprojectideas.com/api/amazon/GetAllProductsByCategoryId?id=' + id);
  }

  register(obj: any): Observable<any> {
    return this.http.post<any>('https://freeapi.miniprojectideas.com/api/amazon/RegisterCustomer', obj);
  }

  login(obj: any): Observable<any> {
    return this.http.post<any>('https://freeapi.miniprojectideas.com/api/amazon/Login', obj);
  }

  addToCart(obj: any): Observable<any> {
    return this.http.post<any>('https://freeapi.miniprojectideas.com/api/amazon/AddToCart', obj);
  }

  getAddToCartDataByCustomerId(id: number): Observable<any[]> {
    return this.http.get<any[]>('https://freeapi.miniprojectideas.com/api/amazon/GetCartProductsByCustomerId?id=' + id);
  }

  deleteProductFromCartById(cartId: number): Observable<any[]> {
    return this.http.get<any[]>('https://freeapi.miniprojectideas.com/api/amazon/DeleteProductFromCartById?id=' + cartId);
  }

  placeOrder(obj: any): Observable<any> {
    return this.http.post<any>('https://freeapi.miniprojectideas.com/api/amazon/PlaceOrder', obj);
  }

}
