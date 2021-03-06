

import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

declare var moment: any;

@Injectable()
export class AppGlobals{

  startDatetime = new BehaviorSubject<Date>(moment().add(-1, "hours").toDate());
  endDatetime = new BehaviorSubject<Date>(null);
  useNowAsEnd = true;

  setStartDatetime(value: Date) {
    this.startDatetime.next(value);
  }

  setEndDatetime(value: Date) {
    this.endDatetime.next(value);
  }

  getEndTime(){
    return this.endDatetime.getValue()? this.endDatetime.getValue().toISOString(): new Date().toISOString();
  }

  getStartTime(){
    return this.startDatetime.getValue().toISOString();
  }

  setInterval(value: number, timeunit: string){
    this.startDatetime.next(moment().add(value, timeunit).toDate());
    console.log(this.startDatetime.getValue());
  }
}
