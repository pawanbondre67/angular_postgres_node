import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


interface Student {
  id?: number;
  firstname: string;  
  lastname : string;
  email: string;
  age: number;
  profile_pic : string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private baseUrl = 'http://localhost:5000/api/students';
 constructor(private http: HttpClient, private router: Router) {}



 getAllStudents() : Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/`);
  }
  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/${id}`);
  }

  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(`${this.baseUrl}/`, student);
  }
  updateStudent(id: number | undefined, student: Student): Observable<Student> {
   
    return this.http.put<Student>(`${this.baseUrl}/${id}`, student);
  }
  deleteStudent(id: number | undefined): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }


}
