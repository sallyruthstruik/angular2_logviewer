/**
 * Created by stas on 16.04.17.
 */

import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Constants} from "../constants";
import {DataSource} from "../components/data_sources.component";
import {Filters} from "../components/logviewer.component";
import {SaveFilter} from "../components/history.component";

@Injectable()
export class DataSourceService{
  private url: string;

  constructor(
    private http: Http
  ){
    this.url = `${Constants.HOST}/api/data_sources`
  }

  public getDataSources(){
      return this.http.get(this.url)
        .map(item=>item.json());
  }

  save(selectedDataSource: DataSource) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if(selectedDataSource.id){
      return this.http.put(
        `${this.url}/${selectedDataSource.id}`,
        JSON.stringify(selectedDataSource),
        {headers}
      ).map(res => res.json())
    }else{
      return this.http.post(
        this.url,
        JSON.stringify(selectedDataSource),
        {headers}
      )
    }
  }

  /**
   * Saves filtration statement into DB
   * @param dataSourceId
   * @param filters
   */
  saveFilter(dataSourceId: string, filters: Filters) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http.post(
      `${this.url}/addhistory/${dataSourceId}`,
      JSON.stringify({filters}),
      {headers}
    )
  }

  getColumns(dataSourceId: string) {
    return this.http.get(
      `${this.url}/getColumns/${dataSourceId}`
    ).map(resp=>resp.json())
  }

  getDataSource(dataSourceId: string) {
    return this.http.get(
      `${this.url}/${dataSourceId}`
    ).map(resp=>resp.json())
  }

  saveFavoriteFilter(dataSourceId: string, saveFilter: SaveFilter) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http.post(
      `${this.url}/saveFavoriteFilter/${dataSourceId}`,
      JSON.stringify(saveFilter),
      {headers}
    )
  }

  getFavorites(dataSourceId: string) {
    return this.http.get(
      `${this.url}/getFavorites/${dataSourceId}`
    ).map(resp=>resp.json())
  }

  deleteFavorite(dataSourceId: string, name: string){
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http.post(
      `${this.url}/deleteFavorite/${dataSourceId}`,
      JSON.stringify({name}),
      {headers}
    )
  }
}

