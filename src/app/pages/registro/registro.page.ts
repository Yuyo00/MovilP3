import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { showAlertDUOC, showToast } from '../../model/message';
import { Usuario } from '../../model/usuario';
import { AuthService } from '../../services/auth.service.service';
import { DataBaseService } from '../../services/data-base.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RegistroPage implements OnInit {

  public usuario: Usuario;
  public nombre : any;
  public apellido: any;
  public correo: any;
  public pregunta: any;
  public respuesta: any;
  public repeticionPassword: any;
  public contraseña: any;
  public nombreValue : any;
  public apellidoValue: any;
  public correoValue: any;
  public preguntaValue: any;
  public respuestaValue: any;
  public repeticionPasswordValue: any;
  public contraseñaValue: any;

  constructor(private router: Router, private authService : AuthService, private bd: DataBaseService ) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
  }

  public login() {
    this.router.navigate(['/login'])
  }

  async crearPerfil() {
    
    this.nombre = document.getElementById('nombre') as HTMLInputElement | null;
    this.apellido = document.getElementById('apellido') as HTMLInputElement | null;
    this.correo = document.getElementById('correo') as HTMLInputElement | null;
    this.pregunta = document.getElementById('pregunta') as HTMLInputElement | null;
    this.respuesta = document.getElementById('respuesta') as HTMLInputElement | null;
    this.repeticionPassword = document.getElementById('password2') as HTMLInputElement | null;
    this.contraseña = document.getElementById('password') as HTMLInputElement | null;

    this.nombreValue = this.nombre.value;
    this.apellidoValue = this.apellido.value;
    this.correoValue = this.correo.value;
    this.preguntaValue = this.pregunta.value;
    this.respuestaValue = this.respuesta.value;
    this.repeticionPasswordValue = this.repeticionPassword.value;
    this.contraseñaValue = this.contraseña.value;

    console.log(this.nombreValue)
    console.log(this.apellidoValue)

    if (this.contraseñaValue !== this.repeticionPasswordValue) {
      showAlertDUOC(`Las contraseñas escritas deben ser iguales.`);
      return;
    }
      await this.bd.crearUsuario(this.correoValue, this.contraseñaValue, this.nombreValue, this.apellidoValue, this.preguntaValue, this.respuestaValue, 'N')
      showToast('Su cuenta fue creada');
  }
}

