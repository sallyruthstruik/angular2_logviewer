import {Component, Input} from '@angular/core';

@Component({
  selector: 'pre-view',
  templateUrl: "app/components/pre_view.component.html",
})
export class PreViewComponent {

  @Input() data: string;

  @Input() event: string = "click"; //or can be mouse

  showed: boolean;

  onClick(){
    if(this.event == "click")
      this.showed = !this.showed;
  }

  onMouseEnter(){
    if(this.event == "mouse"){
      this.showed = true;
    }
  }

  onMouseLeave(){
    if(this.event == "mouse"){
      this.showed = false;
    }
  }

}
