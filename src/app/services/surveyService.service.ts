import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const serviceURL =
  'https://results-recommendation-default-rtdb.firebaseio.com/db.json';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  constructor(private httpClient: HttpClient) {}

  postSurveyResult(data: any): Observable<any> {
    return this.httpClient.post(serviceURL, data);
  }
}
