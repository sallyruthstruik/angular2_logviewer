import {Component, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, Input} from '@angular/core';

declare var $: any;
declare var moment: any;

@Component({
  moduleId: module.id,
  selector: 'datetime',
  templateUrl: "datetime.component.html"
})
export class DatetimePickerComponent implements AfterViewInit {

  datetime: Date;
  format: string;

  @Input() default = new Date();

  @Output() onChange: EventEmitter<Date> = new EventEmitter<Date>();

  @ViewChild('selectElem') el: ElementRef;

  constructor(){
    this.format = "DD.MM.YYYY HH:mm:SS";
  }

  ngAfterViewInit(){
    $(this.el.nativeElement).datetimepicker({
      format: this.format,
      defaultDate: this.default
    });
  }

  onBlur(value: string){
    this.datetime = moment(value, this.format).toDate();
    this.onChange.emit(this.datetime)
  }

}
