import { Component } from '@angular/core';
import { AuthService } from "../../services/auth/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
constructor(private authService: AuthService,private router: Router){}
  handleLogout(){
    this.authService.logout();
    this.router.navigate(['/home']);
  }

}
