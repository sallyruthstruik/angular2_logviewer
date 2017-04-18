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

  /**
   * Returns type of item. Can be small, pre, array, object
   * @param item
   */
  getType(item: any){
    if(Array.isArray(item)){
      return "array"
    }
    if(item && typeof item == "object"){
      return "object"
    }

    if(!item || item.length < 300)
      return "small";

    return "pre"
  }

}
