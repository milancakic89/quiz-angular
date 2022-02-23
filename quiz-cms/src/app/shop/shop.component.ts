import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  constructor() { }

  public centerContent = false;

  ngOnInit(): void {
    if (window.innerHeight > 650) {
      this.centerContent = true;
    }
  }

  @HostListener('window:resize')
  checkCenterLogin() {
    if (window.innerHeight > 650) {
      this.centerContent = true;
    }
  }
}
