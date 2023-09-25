import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';  
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SignupComponent {
  user = { username: '', password: '' };

 
  constructor(
    private authService: AuthService,
    private router: Router, 
    private snackBar: MatSnackBar  
  ) { }

  // Handles the signup process.
  signup(): void {
    this.authService.signup(this.user).subscribe(
        response => {
            console.log('Signup successful', response);
            this.router.navigate(['/login']);
            this.snackBar.open('Signup successful', 'Close', {
                duration: 1000,
                verticalPosition: 'top',
                panelClass: ['mat-snack-bar-success']  
            });
        },
        error => {
            console.error('This username is already registered', error);
            const errorMsg = error.error && error.error.message ? error.error.message : 'This username is already registered';
            this.snackBar.open(errorMsg, 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['mat-snack-bar-error']  
            });
        }
    );
}
}
