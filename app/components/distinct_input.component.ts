/**
 * Created by stas on 29.01.17.
 */

import {Component, Input, EventEmitter, AfterViewInit} from '@angular/core';

@Component({
  selector: 'distinct_input',
  template: `
<style>
  .distinct_input_hint{
    position: relative;
  }
</style>
<div *ngIf="hint">
  <input type="text" class="form-control" [(ngModel)]="inputValue" (ngModelChange)="inputChanged()">
  <div *ngIf="hintData.length > 0 && inputValue.length > 0" class="distinct_input_hint panel panel-default">
    <div class="panel-body">
      <ul>
        <li *ngFor="let item of getHintData()">
          <a href="#" (click)="setItem(item)">{{item}}</a>
        </li>
      </ul>
    </div>
  </div>
</div>
<div *ngIf="!hint">
  <select class="form-control" (change)="setItem($event.target.value)" [(ngModel)]="inputValue">
    <option></option>
    <option *ngFor="let item of data">{{item}}</option>
  </select>
</div>
`,
})
export class DistinctInputComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    if(this.clearEvent)
      this.clearEvent.subscribe((val: boolean)=>{
        this.inputValue = "";
        this.hintData = [];
      })
  }

  @Input() data: string[] = [];
  @Input() onSelect: (value: string)=>null;
  @Input() hint: boolean = false;
  @Input() clearEvent: EventEmitter<boolean>;

  hintData: string[] = [];
  inputValue = "";

  inputChanged(){

    this.hintData = this.data.filter((item)=>{
      return item.indexOf(this.inputValue) != -1;
    });

    this.hintData.sort();

  }

  getHintData(){
    return this.hintData.slice(0, 10);
  }

  setItem(item: string){
    console.log("Set item", item);
    this.inputValue = item;
    this.hintData = [];
    this.onSelect(item);
  }


}
