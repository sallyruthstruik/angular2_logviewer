import {Constants} from "../constants";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
/**
 * Created by stas on 24.04.17.
 */

@Injectable()
export class ChartService {
  private url: string;

  constructor(private http: Http) {
    this.url = `${Constants.HOST}/api/charts`
  }

  getChart(){

  }
}
