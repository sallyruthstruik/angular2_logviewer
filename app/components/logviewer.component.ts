import {Component, ViewChild, ElementRef, AfterViewInit, EventEmitter} from '@angular/core';
import {LogsService} from "../services/logs.service";
import {TruncatePipe} from "../pipes/truncate.pipe";
import {AppGlobals} from "../app.globals";
import {ActivatedRoute} from "@angular/router";
import {DataSourceService} from "../services/data_source.service";

declare var moment: any;
declare var $: any;

@Component({
  selector: 'logviewer',
  templateUrl: "app/components/logviewer.component.html",
  providers: [LogsService, DataSourceService]
})
export class LogviewerComponent {

  page: number;
  page_size: number;
  pages: number;
  total: number;
  results: Log[];
  loading: boolean;
  dataSourceId: string;

  filters: Filters;
  clearEvent = new EventEmitter<boolean>(false);
  filter_history: string[] = [];

  display_fields: string[] = [
    "host",
    "levelname",
    "name",
    "message",
    "request_id",
    "request_ip"
  ];

  distinct_filters = {
    host: {},
    levelname: {},
    name: {
      hint: true
    }
  };

  selected_tags: string[];

  get serializedFilters(){
    return JSON.stringify(this.filters, null, 2);
  }

  set serializedFilters(v){
    try{
      this.filters = JSON.parse(v)
    }catch (e){
      console.log(`Can't parse filters ${v}`, e);
    }
  }

  constructor(
      private logsService: LogsService,
      private dataSourceService: DataSourceService,
      private appGlobals: AppGlobals,
      private route: ActivatedRoute
  ){

    this.page = 1;
    this.page_size = 10;
    this.pages = 0;
    this.results = [];
    this.total = 0;
    this.filters = <Filters>{};
    this.selected_tags = [];

    this.route.params.subscribe(params=>{
      this.dataSourceId = params["id"];
      this.reload();
      this.prefetchDistinctFields();
      this.dataSourceService.getDataSource(this.dataSourceId)
        .subscribe(
          (resp)=>{this.filter_history = resp.query_history; console.log("FH", this.filter_history)},
          (err)=>{console.log(err)}
        )
    });


    this.appGlobals.startDatetime.subscribe((value)=>{
      this.reload()
    });

    this.appGlobals.endDatetime.subscribe((value)=>{
      this.reload();
    });
  }

  prefetchDistinctFields(){
    Object.keys(this.distinct_filters).map((field)=>{
      this.logsService.getValuesForField(this.dataSourceId, field)
        .subscribe(resp=>{
          this.distinct_filters[field].data = resp;
        })
    });
  }

  reload(saveFilter=true){
    this.loading = true;

    if(this.selected_tags.length > 0)
      this.filters["tags"] = {
        "$all": this.selected_tags
      };

    if(saveFilter) {
      this.dataSourceService.saveFilter(this.dataSourceId, this.filters)
        .subscribe(
          (resp) => {
            if (resp.status == 200) {
              this.filter_history.unshift(JSON.stringify(this.filters));
            }
          },
          (err) => {
            console.log(err)
          }
        );
    }

    this.logsService.getLogs(this.dataSourceId, this.page, this.page_size, this.filters)
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
    switch(logLevel.toUpperCase()){
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
    return moment.utc(value).local().format("DD.MM.YYYY HH:mm:ss");
    // return value;
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

  /**
   * Вызывается при клике на элемент истории
   */
  onHistoryItemClicked(item: string){
    this.filters = JSON.parse(item);
    this.reload(false);
  }
}

interface KeyValue{
  key: string;
  value: any;
}

interface Log{
  host: string;
  id: string;
  levelname: string;
  name: string;
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

