import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {
  
  readonly datasetAPIUrl = "http://localhost:7220/api/Dataset";
  
  /*
  httpHeader = new HttpHeaders()
  .set('Access-Control-Allow-Origin', '*');*/

  constructor(private http:HttpClient) { }

  getDatasets():Observable<any[]>{
    return this.http.get<any>(this.datasetAPIUrl + '/getAll').pipe(
      tap(_ => console.log(`fetched all data`)),
      catchError(this.handleError<any>('getDatasets'))
    );
  }

  getpublicDatasets():Observable<any[]>{
    return this.http.get<any>(this.datasetAPIUrl + '/getPublic').pipe(
      tap(_ => console.log(`fetched public data`)),
      catchError(this.handleError<any>('getpublicDatasets'))
    );
  }

  insertDataset(data:any):Observable<any[]>{
    return this.http.post<any>(this.datasetAPIUrl + '/insert',data);
  }

  getData(id: number):Observable<any[]>{
    return this.http.get<any>(this.datasetAPIUrl + `/getData?id=${id}`).pipe(
      tap(_ => console.log(`fetched data id=${id}`)),
      catchError(this.handleError<any>('getData'))
    );
  }
  
  getPage(id: number,page: number):Observable<any[]>{
    return this.http.get<any>(this.datasetAPIUrl + `/getPage?id=${id}&page=${page}`).pipe(
      tap(_ => console.log(`fetched page id=${id}, page=${page}`)),
      catchError(this.handleError<any>('getPage'))
    );
  }

  uploadDataset(file:any):Observable<any[]>{
    return this.http.post<any>(this.datasetAPIUrl + '/upload',file,{
      //reportProgress: true,
      //observe: 'events'
      }).pipe(
      //map(event => this.getEventMessage(event)),
      catchError(this.handleError<any>('uploadDataset'))
    );
  }

  private getEventMessage(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.Sent:
        console.log(`Uploading file.`);
        return;
  
      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = Math.round(100 * event.loaded / (event.total ?? 0));
        console.log(`File is ${percentDone}% uploaded.`);
        return;
  
      case HttpEventType.Response:
        return `File was completely uploaded!`;
  
      default:
        return `File surprising upload event: ${event.type}.`;
    }
  }

  deleteDataset(id: number):Observable<any[]>{
    return this.http.delete<any>(this.datasetAPIUrl + `/delete/${id}`).pipe(
      tap(_ => console.log(`deleted data id=${id}`)),
      catchError(this.handleError<any>('deleteDataset'))
    );
  }

  updateDataset(id: number, data: any):Observable<any[]>{
    return this.http.put<any>(this.datasetAPIUrl + `/update/${id}`, data).pipe(
      tap(_ => console.log(`updated data id=${id}`)),
      catchError(this.handleError<any>('uploadDataset'))
    );;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead
      
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
