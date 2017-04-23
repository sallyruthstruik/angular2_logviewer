import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import {Filters} from "../components/logviewer.component";
import {AppGlobals} from "../app.globals";
import {Constants} from "../constants";
import {DataSourceService} from "./data_source.service";

@Injectable()
export class LogsService{
    private url: string;

    constructor(
        private http: Http,
        private appGlobals: AppGlobals,
        private dataSourceService: DataSourceService
    ){
      this.url = `${Constants.HOST}/api/logs`
    }

    protected updateFilters(filters: Filters): Filters{

      filters = Object.assign({}, filters);

      filters["@timestamp"] = {
          "$lte": this.appGlobals.getEndTime(),
          "$gte": this.appGlobals.getStartTime()
      };

      //filter message as regexp
      if("message" in filters && filters.message.length > 0){
        filters["message"] = {
          $regex: filters["message"],
          $options: "i"
        }
      }

      for(let key in filters){
        if(filters[key] == ""){
          delete filters[key]
        }
      }

      return filters;
    }

    getLogs(dataSourceId: string, page: number, page_size: number, filters: Filters){
      filters = this.updateFilters(filters);

      console.log(`Get logs with parameters dataSourceId=${dataSourceId}, page=${page}, page_size=${page_size}`, filters);
      return this.http.get(`${Constants.HOST}/api/get_logs/${dataSourceId}?page=${page}&page_size=${page_size}&json_filters=${JSON.stringify(filters)}`).map(item=>item.json());
    }

    getValuesForField(dataSourceId: string, field: string) {
      let filters = this.updateFilters(<Filters>{});
      return this.http.get(`${this.url}/distinct?data_source=${dataSourceId}&field=${field}&json_filters=${JSON.stringify(filters)}`)
        .map(item=>item.json());
    }
}
