import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order/order.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-history',
  imports: [],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');

    if (userId) {
      this.orderService.getUserOrders(userId)?.subscribe(data => {
        if (data) {
          this.orders = data;
          console.log(this.orders);
        }
      });
    }
  }
}
