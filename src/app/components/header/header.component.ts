import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from "../../services/auth/auth.service";
import { Router} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
constructor(private authService: AuthService,private router: Router){}
  handleLogout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
