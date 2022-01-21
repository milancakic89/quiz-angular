import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/socket-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private socketService: SocketService) { }

  public clicked = false;

  ngOnInit(): void {
  }

  public onClick(path: string){
    // this.router.navigate([`/${path}`]);
  }

  public createRoom(){
    this.socketService.emit('CREATE-ROOM',{user_id: 'fsdanskjh32382374y2'})
  }

}
