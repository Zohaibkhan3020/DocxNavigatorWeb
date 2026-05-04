import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { IdleService } from 'src/app/services/idle.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent {

 
  username = '';
  password = '';
  hide = true;
  isDark = false;

  constructor(private dialog: MatDialog,private fb:FormBuilder,
    private auth:AuthService,
    private router: Router, private idleService: IdleService
  ) {}
loginForm = this.fb.group({
  Username: ['', Validators.required],
  password: ['', Validators.required]
});
 onLogin(form: any) {

  if (form.invalid) {
    Object.values(form.controls).forEach((control: any) => {
      control.markAsTouched(); // 🔥 show errors
    });
    return;
  }
debugger;
// 🔥 sirf relevant cheezen clear karo
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('id');
  localStorage.removeItem('RoleID');

  this.auth.login(form.value).subscribe({
    next: (token: string) => {

     // this.hideLoader();

      if (!token) {
        alert('Token not received');
        return;
      }

      // ✅ store token
      this.auth.storeToken(token);

      // ✅ decode safely
      const decoded: any = this.auth.getDecodedToken();

      if (!decoded) {
        alert('Invalid token');
        return;
      }

      console.log("Decoded:", decoded);

      // ✅ fallback-safe assignments
      localStorage.setItem('username', decoded?.Username || '');
      localStorage.setItem('id', decoded?.Id || '');
      localStorage.setItem('RoleID', decoded?.RoleID || '');

      // ✅ navigate
      this.router.navigate(['/dashboard']);

      alert("Successfully Login !!!");
    },

    error: (err) => {
      //this.hideLoader();

      console.error('Login Error:', err);

      // better error handling
      const msg = err?.error || 'Login failed';
      alert(msg);
    }
  });
}

  toggleTheme() {
    this.isDark = !this.isDark;
  }

  openForgotPassword() {
    //this.dialog.open(ForgotPasswordDialog);
  }
}
  
