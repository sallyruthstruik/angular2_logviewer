import {Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {LogsService} from "../services/logs.service";
import {TruncatePipe} from "../pipes/truncate.pipe";
import {AppGlobals} from "../app.globals";

declare var moment: any;
declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'logviewer',
  templateUrl: "logviewer.component.html",
  providers: [LogsService]
})
export class LogviewerComponent {

  page: number;
  page_size: number;
  pages: number;
  total: number;
  results: Log[];
  loading: boolean;

  filters: Filters;

  display_fields: string[] = [
    "host",
    "level",
    "logger_name",
    "message",
    "request_id",
    "request_ip"
  ];

  distinct_filters = [
    "host",
    "level"
  ];

  distinct_filters_data: any;

  constructor(
      private logsService: LogsService,
      private appGlobals: AppGlobals
  ){

    this.page = 1;
    this.page_size = 10;
    this.pages = 0;
    this.results = [];
    this.total = 0;
    this.filters = <Filters>{};
    this.distinct_filters_data = {};

    this.appGlobals.startDatetime.subscribe((value)=>{
      this.reload()
    });

    this.appGlobals.endDatetime.subscribe((value)=>{
      this.reload();
    });

    this.reload();

    this.prefetchDistinctFields();
  }

  prefetchDistinctFields(){
    this.distinct_filters.map((field)=>{
      this.logsService.getValuesForField(field)
        .subscribe(resp=>{
          this.distinct_filters_data[field] = resp;
          console.log(this.distinct_filters_data);
        })
    });

    this.logsService.getValuesForField("logger_name")
      .subscribe(resp=>{
        this.distinct_filters_data.logger_name = resp;
        $(this.loggerNameSelect.nativeElement).selectpicker();
      });
  }

  reload(){
    this.loading = true;

    this.logsService.getLogs(this.page, this.page_size, this.filters)
      .subscribe(resp=>{
        this.page = resp.page;
        this.page_size = resp.page_size;
        this.pages = resp.pages;
        this.results = resp.results;
        this.total = resp.total;
        this.loading = false;
      });
  }

  clearFilters(){
    this.filters = <Filters>{};
    this.reload();
  }

  keys(item: any): Array<string>{
    return Object.keys(item).filter((el)=>this.display_fields.indexOf(el) == -1);
  }

  getMeta(item: any): Array<KeyValue>{
    let out: Array<KeyValue> = [];

    for(let key in item.metadata){
      let value = item.metadata[key];
      out.push({key, value})
    }

    return out;
  }

  setFilter(field: string, value: any){
    this.filters[field] = value;
    this.reload();
  }

  getLineClass(logLevel: string){
    switch(logLevel){
      case "INFO":
        return "success";
      case "WARN":
        return "warning";
      case "ERROR":
        return "danger";
      case "CRITICAL":
        return "danger";
    }
  }

  toLocalDate(value: string){
    return moment.utc(value).local().format("DD.MM.YYYY HH:mm:SS")
  }

}

interface KeyValue{
  key: string;
  value: any;
}

interface Log{
  host: string;
  id: string;
  level: string;
  logger_name: string;
  message: string;
  path: string;
  request_id: string;
  request_ip: string;
  sid: string;
  tags: string[];
  meta: any;
}

export interface Filters{
  request_id: string;
}
