import {Component, Input, OnInit} from "@angular/core";
import {ControlValueAccessor} from "@angular/forms";
/**
 * Created by stas on 24.04.17.
 */

const noop = ()=>{};

@Component({
  selector: "jsontextarea",
  template: `
<textarea class="form-control" [(ngModel)]="value" rows="4"></textarea>
`
})
export class JsonTextarea implements ControlValueAccessor, OnInit{
  ngOnInit(): void {
    this.innerValue = this.innerValue || this.initial;
  }

  @Input() initial: any;
  private innerValue: any = null;
  private onChangeCallback: (_: any)=>void=noop;

  get value(){
    return JSON.stringify(this.innerValue, null, 2);
  }

  set value(v){
    try{
      this.innerValue = JSON.parse(v);
    }catch (e){}
  }

  writeValue(value: any): void {
    if(value !== this.innerValue){
      this.innerValue = value;
      this.onChangeCallback(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
  }



}
