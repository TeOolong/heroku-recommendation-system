import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';

const serviceURL =
  'https://machine-learning-6b2d1-default-rtdb.firebaseio.com/db2.json';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  dbRecommendations = '/db2';
  recommendations: AngularFireList<any>;

  constructor(private db: AngularFireDatabase, private httpClient: HttpClient) {
    this.recommendations = db.list(this.dbRecommendations);
  }

  getAllRecommendations(): Observable<any> {
    return this.httpClient.get(serviceURL);
  }

  getAllKeys(): Observable<any> {
    return this.recommendations.snapshotChanges().pipe(
      map((items: any) => {
        return items.map((item: any) => item.key);
      })
    );
  }

  getByKey(key: string): Observable<any> {
    return this.db.object('/db2/' + key).valueChanges();
  }
}
