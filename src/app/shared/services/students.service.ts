import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  private readonly API = `${environment.apiURL}/students`;

  constructor(private http: HttpClient) { }

  getAll(page: number = 0): Observable<any> {
    return this.http.get(`${this.API}?size=15&sort=id,desc&page=${page}`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.API}/${id}`).pipe(
      concatMap(student => this.http.get(`${this.API}/${id}/courses`).pipe(
        map((response: any) => ({...student, courses: response._embedded.courses}))
      ))
    );
  }

  save(student: any): Observable<any> {
    const courses = student.courses;
    delete student.courses;
    let observable$;

    if (student.id) {
      observable$ = this.update(student);
    } else {
      observable$ = this.create(student);
    }


    return observable$.pipe(
      concatMap(() => this.updateCourses(student.id, courses))
    );
  }

  update(student: any): Observable<any> {
    return this.http.put(`${this.API}/${student.id}`, student);
  }

  updateCourses(id: number, courses: any[]): Observable<any> {
    const body = courses.map(course => {
      return `${environment.apiURL}/course/${course.id}`;
    }).join('\n');
    const headers =  { "Content-Type": "text/uri-list" };

    return this.http.put(`${this.API}/${id}/courses`, body, {headers});
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }

  create(student: any): Observable<any> {
    return this.http.post(this.API, student);
  }

}
