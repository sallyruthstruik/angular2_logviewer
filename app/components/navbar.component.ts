
import {Component} from "@angular/core";
import {AppGlobals} from "../app.globals";

declare var moment: any;

@Component({
  selector: 'navbar',
  templateUrl: "app/components/navbar.component.html"
})
export class NavbarComponent  {

  private _endNow: boolean;

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

  constructor(private _appGlobals: AppGlobals){
    this.endNow = true;
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
