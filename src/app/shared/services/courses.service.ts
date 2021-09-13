import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly API = `${environment.apiURL}/courses`;

  constructor(private http: HttpClient) { }

  getAll(page: number = 0): Observable<any> {
    return this.http.get(`${this.API}?size=15&sort=id,desc&page=${page}`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.API}/${id}`);
  }

  save(course: any): Observable<any> {
    if (course.id) {
      return this.update(course);
    }

    return this.create(course);
  }

  private update(course: any): Observable<any> {
    return this.http.put(`${this.API}/${course.id}`, course);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }

  private create(course: any): Observable<any> {
    return this.http.post(this.API, course);
  }

}
