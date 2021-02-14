import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from 'src/app/store/auth-store/auth.actions';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loginSub: Subscription;
  isLoading = false;
  isResendLinkActive = false;
  message: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: this.fb.control(null, [Validators.required, Validators.email]),
      password: this.fb.control(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ]),
      rememberMe: this.fb.control(false),
    });

    this.loginSub = this.store
      .select('auth')
      .pipe(
        take(1),
        map((authState) => {
          return {
            isLoading: authState.isLoading,
            user: authState.user,
            errorMessage: authState.authErrorMessage,
          };
        })
      )
      .subscribe((authState) => {
        this.isLoading = authState.isLoading;
        this.message = authState.errorMessage;
      });
  }

  login(): void {
    console.log(this.loginForm.value);
    this.isResendLinkActive = false;
    this.store.dispatch(
      new AuthActions.LoginStart({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        rememberMe: this.loginForm.value.rememberMe,
      })
    );
  }

  resendVerificationEmail() {
    this.isLoading = true;
    this.isResendLinkActive = false;
    this.authService
      .resendVerification(
        this.loginForm.value.email,
        this.loginForm.value.password
      )
      .subscribe(
        (response) => {
          this.message = response.message;
          this.isLoading = false;
        },
        (errorMessage) => {
          this.message = errorMessage;
          this.isLoading = false;
        }
      );
  }

  socialClicked(type: string) {
    console.log(type + ' clicked');
  }

  toggleForgettenPassword() {
    this.router.navigate(['/forgot-password']);
  }

  routeRegister() {
    this.router.navigate(['/register']);
  }

  ngOnDestroy(): void {
    this.loginSub.unsubscribe();
  }
}
