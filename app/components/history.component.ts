/**
 * Created by stas on 22.04.17.
 */


import {Component, Input, OnInit} from '@angular/core';
import {DataSourceService} from "../services/data_source.service";
import {Filters} from "./logviewer.component";

export interface SaveFilter{
  name: string;
  filter: any;
}

@Component({
  selector: 'history_component',
  templateUrl: "app/components/history.component.html",
  providers: [DataSourceService]
})
export class HistoryComponent implements OnInit{
  showModal = false;

  saveFilter = {} as SaveFilter;

  tab = "history";
  favorites: SaveFilter[] = [];
  @Input() history: Filters[];

  @Input() onFilterClicked: ()=>any;
  @Input() dataSourceId: string;
  constructor(
    private ds: DataSourceService
  ){
  }

  ngOnInit(): void {
    this.loadFavorites()
  }

  onSaveFilter(){
    this.ds.saveFavoriteFilter(
      this.dataSourceId,
      this.saveFilter
    ).subscribe(
      (resp)=>{console.log(resp); this.showModal=false},
      (err)=>console.log(err)
    )
  }

  deleteFavorite(item: SaveFilter){
    this.ds.deleteFavorite(
      this.dataSourceId, item.name
    ).subscribe(
      (resp)=>{
        this.loadFavorites();
      },
      (err)=>console.log(err)
    )
  }

  private loadFavorites() {
    this.ds.getFavorites(this.dataSourceId).subscribe(
      (resp)=>{this.favorites = resp as SaveFilter[]},
      (err)=>console.log(err)
    )
  }
}
