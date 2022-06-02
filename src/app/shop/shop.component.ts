import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Configuration } from '../shared/config.service';
import { NotificationService } from '../shared/notification.service';
import { SocketService } from '../socket-service';
import { ShopItem } from './types';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {

  constructor(private sockerService: SocketService,
              private notifications: NotificationService,
              private config: Configuration) { }

  public centerContent = false;
  public receivedItem = false;
  public purchasingModal = false;
  public purchaseLink = '';
  public shopItem = ShopItem;
  private subscription: Subscription = null as unknown as Subscription;

  ngOnInit(): void {
    if (window.innerHeight > 650) {
      this.centerContent = true;
    }
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  @HostListener('window:resize')
  checkCenterLogin() {
    if (window.innerHeight > 650) {
      this.centerContent = true;
    }
  }

  public purchasing(){
    setTimeout(()=>{
      this.purchasingModal = true
    }, 500)
  }

  public buyItem(item: ShopItem){
    this.sockerService.emit('BUY_ITEM', {item, section: 'borders'})
  }
}
