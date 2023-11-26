import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router'; 
import { AuthService } from '../../services/auth.service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  public correoEscrito = 'atorres@duocuc.cl';
  public passwordEscrita = '1234';

  constructor(private router: Router, private authService: AuthService) { 
  }

  ngOnInit() {
  }

  async ingresar() {
    this.authService.login(this.correoEscrito, this.passwordEscrita);
  }

  public correo() {
    this.router.navigate(['/correo']); 
  }

  public registro() {
    this.router.navigate(['/registro'])
  }

}