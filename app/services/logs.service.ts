import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import {Filters} from "../components/logviewer.component";

@Injectable()
export class LogsService{
    private logsUrl: string;

    constructor(private http: Http){
      this.logsUrl = "http://localhost:8000/api/logs"
    }

    getLogs(page: number, page_size: number, filters: Filters){
      return this.http.get(`${this.logsUrl}?page=${page}&page_size=${page_size}&json_filters=${JSON.stringify(filters)}`).map(item=>item.json());
    }
}
