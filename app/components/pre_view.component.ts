import {Component, Input} from '@angular/core';

@Component({
  selector: 'pre-view',
  templateUrl: "app/components/pre_view.component.html",
})
export class PreViewComponent {

  @Input() data: string;
  showed: boolean;

}
