
import {Component} from "@angular/core";
import {AppGlobals} from "../app.globals";

declare var moment: any;

@Component({
  moduleId: module.id,
  selector: 'navbar',
  templateUrl: "navbar.component.html"
})
export class NavbarComponent  {

  constructor(private _appGlobals: AppGlobals){
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

}
