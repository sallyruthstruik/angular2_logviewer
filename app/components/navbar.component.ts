
import {Component} from "@angular/core";
import {AppGlobals} from "../app.globals";
import {DataSourceService} from "../services/data_source.service";
import {DataSource} from "./data_sources.component";

declare var moment: any;

@Component({
  selector: 'navbar',
  templateUrl: "app/components/navbar.component.html",
  providers: [DataSourceService]
})
export class NavbarComponent  {

  private _endNow: boolean;
  private dataSources: DataSource[] = [];

  get endNow(): boolean{
    return this._endNow;
  }

  set endNow(value: boolean){
    this._endNow = value;

    if(this._endNow){
      this._appGlobals.setEndDatetime(null);
    }else{
      this._appGlobals.setEndDatetime(new Date());
    }
  }

  constructor(
    private _appGlobals: AppGlobals,
    private dataSourceService: DataSourceService
  ){
    this.endNow = true;

    this.dataSourceService.getDataSources().subscribe(
      (resp)=>{this.dataSources = resp.results},
      (err)=>{console.log(err)}
    )
  }

  startChanged(value: Date){
    this._appGlobals.setStartDatetime(value);
  }

  endChanged(value: Date){
    this._appGlobals.setEndDatetime(value);
  }

  getStart(){
    return this._appGlobals.startDatetime.getValue();
  }

  test(){
    console.log("NOW AS END", this.endNow);
  }

}
