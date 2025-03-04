import { Component } from '@angular/core';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";




@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private oauthService: OAuthService) {
    this.oauthService.configure({
      issuer: 'https://accounts.google.com',
      redirectUri: window.location.origin,
      clientId: 'YOUR_GOOGLE_CLIENT_ID',
      scope: 'openid profile email',
      strictDiscoveryDocumentValidation: false
    });
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
  }

  onSubmit(): void {
    console.log('Register Form Submitted');
  }

  loginWithGoogle(): void {
    this.oauthService.initImplicitFlow();
  }

  loginWithFacebook(): void {
  }
}