import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../_module/Material.Module';
import { ReactiveFormsModule } from '@angular/forms';
import { Student, StudentFormComponent } from '../studentForm/studentForm.component';
import { Observable } from 'rxjs';
import { StudentsService } from '../../services/students/students.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  standalone: true
})
export class HomeComponent {
  
  students$: Observable<Student[]>;
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'email', 'age', 'actions'];

  constructor(
    private studentsService: StudentsService,
    private dialog: MatDialog
  ) {
    this.students$ = this.studentsService.getAllStudents();
  }

  openForm() {
    this.dialog.open(StudentFormComponent, {
      width: '500px',
      data: { student: null }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.students$ = this.studentsService.getAllStudents();
      }
    });
  }

  editStudent(student: Student) {
    this.dialog.open(StudentFormComponent, {
      width: '500px',
      data: { student }
    }).afterClosed().subscribe(result => {
      console.log("result", result);
      if (result) {
        this.students$ = this.studentsService.getAllStudents();
      }
    });
  }

  deleteStudent(id: number) {
    this.studentsService.deleteStudent(id).subscribe({
      next: () => {
        this.students$ = this.studentsService.getAllStudents();
      },
      error: (error) => console.error('Error deleting student:', error)
    });
  }
}