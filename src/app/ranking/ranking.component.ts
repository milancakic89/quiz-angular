import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../shared/config.service';
import { SocketService } from '../socket-service';
import { RankingService } from './ranking-service';

interface Filter{
  filter: string,
  id: number,
  label: string,
  selected: boolean
}
@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit, OnDestroy {

  constructor(private socketService: SocketService) { }

  public rankedPlayers: User[] = [];
  private subscription: Subscription = null as unknown as Subscription;
  public filters: Filter[] = [
    {
      filter: '50',
      id: 1,
      label: '0 - 50',
      selected: false
    },
    {
      filter: '100',
      id: 2,
      label: '50 - 100',
      selected: true
    },
    {
      filter: '150',
      id: 3,
      label: '100 - 150',
      selected: false
    },
    {
      filter: '200',
      id: 4,
      label: '150 - 200',
      selected: false
    }
  ]

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.subscription = this.socketService.socketData.subscribe(data =>{
      if(data && data.event === 'GET_RANKING_LIST'){
        console.log(data)
        this.rankedPlayers = data.data.sort((a:User, b: User) => {
          if(a.score > b.score){
            return -1;
          }
          else if(b.score > a.score){
            return 1;
          }else{
            return 0
          }
        });
      }
    })
    this.load() 
  }

  public async load(){
    this.socketService.emit('GET_RANKING_LIST', {})
  }

  public trackByFn(i: number){
    return i;
  }

  public onSelectFilter(filter: Filter){
    this.filters.forEach(f => f.selected = false);
    filter.selected = true;
  }

}
