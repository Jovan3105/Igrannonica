import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  readonly datasetAPIUrl = "https://localhost:7220/api/Dataset";

  constructor(private http:HttpClient) { }

  getDatasets():Observable<any[]>{
    return this.http.get<any>(this.datasetAPIUrl + '/getAll');
  }

  getpublicDatasets():Observable<any[]>{
    return this.http.get<any>(this.datasetAPIUrl + '/getPublic');
  }

  insertDataset(data:any):Observable<any[]>{
    return this.http.post<any>(this.datasetAPIUrl + '/insert',data);
  }

  getData(id: number):Observable<any[]>{
    return this.http.get<any>(this.datasetAPIUrl + `/getData/${id}`);
  }
  
  //sredi URL
  getPage(id: number,page: number):Observable<any[]>{
    return this.http.get<any>(this.datasetAPIUrl + '/getPage');
  }

  uploadDataset(file:any):Observable<any[]>{
    return this.http.post<any>(this.datasetAPIUrl + 'upload',file);
  }

  deleteDataset(id: number):Observable<any[]>{
    return this.http.delete<any>(this.datasetAPIUrl + `/delete/${id}`);
  }

  updateDataset(id: number, data: any):Observable<any[]>{
    return this.http.put<any>(this.datasetAPIUrl + `/update/${id}`, data);
  }
}
