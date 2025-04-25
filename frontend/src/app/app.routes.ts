import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NotFoundComponent } from './notFound/notFound.component';

export const routes: Routes = [
   {
    
      path: '',
      component: HomeComponent
   },
   {
      path: 'login',
      component: LoginComponent
   },
   {
    path:'signup',
    component: SignupComponent
   },
   {
      path: '**',
      redirectTo: '',
      pathMatch: 'full',  
      component : NotFoundComponent
    // Wildcard route redirects to  notFoundComponent
    // This should be the last route in the array   
    // because it will match any path that is not defined above
    // and will redirect to the notFoundComponent
    // You can also use a 404 page instead of redirecting to a component
    

      
   }
];
