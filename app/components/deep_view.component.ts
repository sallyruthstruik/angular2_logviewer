/**
 * Created by stas on 15.01.17.
 */

import {Component, Input} from '@angular/core';

@Component({
  selector: 'deep-view',
  templateUrl: "app/components/deep_view.component.html",
})
export class DeepViewComponent  {

  @Input() data: any;
  showed: boolean;

  constructor(){
    this.showed = false;
  }

  getKeys(){
    console.log("DATA", this.data);
    if(this.data)
      return Object.keys(this.data);
    return [];
  }

  isComplex(item: any){
    if(item && typeof item == "object")
      return true;
  }

  isSmallText(item: any){
    if(!item){
      return true;
    }

    return item.length < 300;
  }

}
