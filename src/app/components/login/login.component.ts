import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    credentials = { username: '', password: '' };

    constructor(
        private authService: AuthService, 
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    // Function to perform user login
    login(): void {
        this.authService.login(this.credentials).subscribe(
            response => {
                console.log('Login successful', response);
                this.router.navigate(['/books']);  
                this.snackBar.open('Login Successful!', '', { 
                    duration: 1000,  
                    verticalPosition: 'top',  
                    panelClass: ['green-snackbar']  
                });
            },
            error => {
                console.error('Login failed', error);
                this.snackBar.open('Login Failed. Please try again.', '', { 
                    duration: 2000,  
                    verticalPosition: 'top',  
                    panelClass: ['error-snackbar']  
                });
            }
        );
    }
}
