import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ColumnFillMethodPair } from '../models/dataset_models';
import { ModifiedData } from '../models/table_models';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {
  
  readonly datasetAPIUrl = environment.apiUrl + "/Datasets";
  
  /*
  httpHeader = new HttpHeaders()
  .set('Access-Control-Allow-Origin', '*');*/

  constructor(private http: HttpClient) { }

  getDatasets(): Observable<any[]> {
    return this.http.get<any>(this.datasetAPIUrl).pipe(
      tap(_ => console.log(`fetched all data`)),
      catchError(this.handleError)
    );
  }

  getpublicDatasets(): Observable<any[]> {
    return this.http.get<any>(this.datasetAPIUrl + '?p=1').pipe(
      tap(_ => console.log(`fetched public data`)),
      catchError(this.handleError)
    );
  }

  insertDataset(data: any): Observable<any[]> {
    return this.http.post<any>(this.datasetAPIUrl, data);
  }

  getData(id: number): Observable<any[]> {
    return this.http.get<any>(this.datasetAPIUrl + `/${id}/Data`).pipe(
      tap(_ => console.log(`fetched data id=${id}`)),
      catchError(this.handleError)
    );
  }

  getPage(id: number, page: number): Observable<any[]> {
    return this.http.get<any>(this.datasetAPIUrl + `/${id}/Data?page=${page}`).pipe(
      tap(_ => console.log(`fetched page id=${id}, page=${page}`)),
      catchError(this.handleError)
    );
  }
  
  uploadDatasetFile(source: any): Observable<any[]> {
    return this.http.post<any>(this.datasetAPIUrl + '/uploadFile', source, {
      //reportProgress: true,
      //observe: 'events'
    }).pipe(
      //map(event => this.getEventMessage(event)),
      catchError(this.handleError)
    );
  }

  uploadDatasetFileWithLink(source: string): Observable<any[]> {
    return this.http.post<any>(this.datasetAPIUrl + `/uploadWithLink?url=${source}`, null, {
      //reportProgress: true,
      //observe: 'events'
      }).pipe(
      //map(event => this.getEventMessage(event)),
      catchError(this.handleError)
    );
  }

  getStatIndicators(id: number): Observable<any> {
    return this.http.get<any>(this.datasetAPIUrl + `/${id}/stat-indicators`).pipe(
      tap(_ => console.log(`fetched page id=${id}`)),
      catchError(this.handleError)
    );
  }

  parseDataset(source: any): Observable<any[]> {
    return this.http.post<any>(this.datasetAPIUrl + '/parse', source, {
      //reportProgress: true,
      //observe: 'events'
    }).pipe(
      //map(event => this.getEventMessage(event)),
      catchError(this.handleError)
    );
  }

  modifyDataset(id: number, source: ModifiedData): Observable<any[]> {
    return this.http.post<any>(this.datasetAPIUrl + `/${id}/modifyData`, source).pipe(
      tap(_ => console.log(`sent modified data`)),
      catchError(this.handleError)
    );
  }

  deleteDataset(id: number): Observable<any[]> {
    return this.http.delete<any>(this.datasetAPIUrl + `/${id}`).pipe(
      tap(_ => console.log(`deleted data id=${id}`)),
      catchError(this.handleError)
    );
  }

  updateDataset(id: number, data: any): Observable<any[]> {
    return this.http.put<any>(this.datasetAPIUrl + `/${id}`, data).pipe(
      tap(_ => console.log(`updated data id=${id}`)),
      catchError(this.handleError)
    );;
  }
  
  getCorrMatrix(id:any):Observable<any>{
    return this.http.get<any>(this.datasetAPIUrl +`/${id}/corr-matrix`).pipe(
      //tap(_ => console.log(`fetched page id=${id}`)),
      catchError(this.handleError)
    );
  }

  fillMissingValues(id:any, colFillMethodPairs: ColumnFillMethodPair[]):Observable<any>{
    return this.http.post<any>(this.datasetAPIUrl +`/${id}/fillMissing`, colFillMethodPairs).pipe(
      //tap(_ => console.log(`fetched page id=${id}`)),
      catchError(this.handleError)
    );
  }
  /*
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead

      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  */
  private handleError(error: HttpErrorResponse) {

    if (error.status === 0) { // greska na klijentskoj strani
      
      //console.error('An error occurred:', error.error);
      return throwError(() => new Error('Something bad happened; please try again later.'));

    } else { //greska na serveru, bad request ili tako nesto

      //console.error(`Backend returned code ${error.status}, body was: `, error.error.data.errors[0].message);
      return throwError(() => new Error(error.error.data.errors[0].message));
    }
    
  }
}
