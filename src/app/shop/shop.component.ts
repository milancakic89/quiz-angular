import { Component, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Configuration } from '../shared/config.service';
import { SocketService } from '../socket-service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  constructor(private sockerService: SocketService, private config: Configuration) { }

  public centerContent = false;
  public purchasingModal = false;
  public purchaseLink = '';
  private subscription: Subscription = null as unknown as Subscription;

  ngOnInit(): void {
    if (window.innerHeight > 650) {
      this.centerContent = true;
    }
    this.subscription = this.sockerService.socketData.subscribe(data => {
      if(data && data.event === 'BUY_ITEM' ){
        this.config.user.next(data.data)
      }
    })
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

  public buyItem(item: string){
    this.sockerService.emit('BUY_ITEM', {item})
  }
}
