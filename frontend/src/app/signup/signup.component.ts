import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../_module/Material.Module';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [RouterLink, MaterialModule, ReactiveFormsModule]
})
export class SignupComponent {
 hidePassword = true;
  
  // Using FormGroup for better form management
  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private router: Router, private authService: AuthService) { }

  onSubmit() {
    if (this.signupForm.valid) {
      const { email, password } = this.signupForm.value;
      
      this.authService.signUp(email || '', password || '').subscribe({
        next: (response) => {
          console.log('Signup successful', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Signup failed', error);
          alert(error.error.message);
        }
      });
    } else {
      // Mark all controls as touched to show validation errors
      this.signupForm.markAllAsTouched();
    }
  }

}
