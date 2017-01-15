

import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

declare var moment: any;

@Injectable()
export class AppGlobals{

  startDatetime = new BehaviorSubject<Date>(moment().add(-1, "days").toDate());
  endDatetime = new BehaviorSubject<Date>(new Date());

  setStartDatetime(value: Date) {
    this.startDatetime.next(value);
  }

  setEndDatetime(value: Date) {
    this.endDatetime.next(value);
  }
}
