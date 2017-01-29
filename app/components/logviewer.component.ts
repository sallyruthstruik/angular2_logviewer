import {Component, ViewChild, ElementRef, AfterViewInit, EventEmitter} from '@angular/core';
import {LogsService} from "../services/logs.service";
import {TruncatePipe} from "../pipes/truncate.pipe";
import {AppGlobals} from "../app.globals";

declare var moment: any;
declare var $: any;

@Component({
  selector: 'logviewer',
  templateUrl: "app/components/logviewer.component.html",
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
  clearEvent = new EventEmitter<boolean>(false);

  display_fields: string[] = [
    "host",
    "level",
    "logger_name",
    "message",
    "request_id",
    "request_ip"
  ];

  distinct_filters = {
    host: {},
    level: {},
    logger_name: {
      hint: true
    }
  };

  selected_tags: string[];

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
    this.selected_tags = [];

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
    Object.keys(this.distinct_filters).map((field)=>{
      this.logsService.getValuesForField(field)
        .subscribe(resp=>{
          this.distinct_filters[field].data = resp;
        })
    });
  }

  reload(){
    this.loading = true;

    if(this.selected_tags.length > 0)
      this.filters["tags"] = {
        "$all": this.selected_tags
      };

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
    this.selected_tags = [];
    this.clearEvent.emit(true);
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
    return moment.utc(value).local().format("DD.MM.YYYY HH:mm:ss")
  }

  getTagClass(tag: string){
    if(this.selected_tags.indexOf(tag) == -1){
      return "label-primary"
    }
    return "label-success"
  }

  clickedTag(tag: string){
    if(this.selected_tags.indexOf(tag) == -1){
      this.selected_tags.push(tag)
    }else{
      this.selected_tags = this.selected_tags.filter(val=>val!=tag);
    }

    this.reload();
  }

  get selected_tags_model(){
    return this.selected_tags.join(",");
  }

  set selected_tags_model(value: string){
    if(value.length > 0) {
      this.selected_tags = value.split(",");
    }else{
      this.selected_tags = [];
    }
  }

  onPageSet = (page: number)=>{
    this.page = page;
    this.reload();
  };

  /**
   * Возвращает названия фильтров
   * @returns {string[]}
   */
  getDistinctFieldNames(){
    return Object.keys(this.distinct_filters);
  }

  /**
   * Возвращает колбек который вызывается при выборе значения для distinct_filter
   * @param field
   */
  onDistinctFilterSelected(field: string){
    return (value: string)=>{
      this.filters[field] = value;
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
  message: any;
}

