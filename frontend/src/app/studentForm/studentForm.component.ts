import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentsService } from '../../services/students/students.service';
import { MaterialModule } from '../../_module/Material.Module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface Student {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  age: number;
  profile_pic: string;
}

@Component({
  selector: 'app-studentForm',
  templateUrl: './studentForm.component.html',
  styleUrls: ['./studentForm.component.css'],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  standalone: true
})
export class StudentFormComponent {
  studentForm: FormGroup;
  student: Student | null = null;

  constructor(
    private fb: FormBuilder,
    private studentsService: StudentsService,
    public dialogRef: MatDialogRef<StudentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { student: Student | null }
  ) {
    this.student = data.student;
    this.studentForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: [0, [Validators.required, Validators.min(1)]],
      profile_pic: ['']
    });

    if (this.student) {
      this.studentForm.patchValue(this.student);
    }
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const studentData: Student = this.studentForm.value;
      studentData.id = this.student?.id ;

      const operation = this.student
        ? this.studentsService.updateStudent(this.student.id, studentData)
        : this.studentsService.addStudent(studentData);

      operation.subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.studentForm.reset();
        },
        error: (error) => console.error('Error saving student:', error)
      });
    }
  }

  onCancel() {
    this.dialogRef.close(false);
    this.studentForm.reset();
  }
}