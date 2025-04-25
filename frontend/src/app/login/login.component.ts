import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../_module/Material.Module';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [RouterLink, MaterialModule, ReactiveFormsModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hidePassword = true;
  
  // Using FormGroup for better form management
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private router: Router, private authService: AuthService) { 

    this.authService.getCurrentUser()?.accessToken
      ? this.router.navigate(['/'])
      : console.error('No access token available');
      

  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email || '', password || '').subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.router.navigate(['/']);
          this.authService.user$.subscribe(user => {  
            if (user) {
              console.log('User data:', user);
            } else {
              console.log('No user data available');
            }
          }
          );
        },
        error: (error) => {
          console.error('Login failed', error);
          alert(error.error.message);
        }
      });
    } else {
      // Mark all controls as touched to show validation errors
      this.loginForm.markAllAsTouched();
    }
  }

  someFunction() {
    console.log('Some function triggered');
  }
}