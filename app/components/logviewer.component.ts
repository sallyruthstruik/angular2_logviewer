import { Component } from '@angular/core';
import {LogsService} from "../services/logs.service";
import {TruncatePipe} from "../pipes/truncate.pipe";

@Component({
  moduleId: module.id,
  selector: 'logviewer',
  templateUrl: "logviewer.component.html",
  providers: [LogsService]
})
export class LogviewerComponent  {

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

  constructor(private logsService: LogsService){

    this.page = 1;
    this.page_size = 10;
    this.pages = 0;
    this.results = [];
    this.total = 0;
    this.filters = <Filters>{};

    this.reload();
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

        console.log(this.results);
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
    }
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
