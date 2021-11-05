import { Component, OnInit } from '@angular/core';

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
export class RankingComponent implements OnInit {

  constructor() { }

  public rankedPlayers = [1,2,3,4,5,6]
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

  ngOnInit(): void {
  }

  public onSelectFilter(filter: Filter){
    this.filters.forEach(f => f.selected = false);
    filter.selected = true;
  }

}
