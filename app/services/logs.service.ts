import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import {Filters} from "../components/logviewer.component";
import {AppGlobals} from "../app.globals";

@Injectable()
export class LogsService{
    private logsUrl: string;

    constructor(
        private http: Http,
        private appGlobals: AppGlobals
    ){
      this.logsUrl = "http://localhost:8000/api/logs"
    }

    protected updateFilters(filters: any){

      filters = Object.assign({}, filters);

      filters["@timestamp"] = {
          "$lte": this.appGlobals.getEndTime(),
          "$gte": this.appGlobals.getStartTime()
      };

      //filter message as regexp
      if("message" in filters){
        filters["message"] = {
          $regex: filters["message"],
          $options: "i"
        }
      }


      return filters;
    }

    getLogs(page: number, page_size: number, filters: Filters){
      filters = this.updateFilters(filters);
      return this.http.get(`${this.logsUrl}?page=${page}&page_size=${page_size}&json_filters=${JSON.stringify(filters)}`).map(item=>item.json());
    }

    getValuesForField(field: string) {
      let filters = this.updateFilters({});
      return this.http.get(`${this.logsUrl}/distinct?field=${field}`)
        .map(item=>item.json());
    }
}
