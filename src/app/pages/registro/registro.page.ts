import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
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

  constructor(private router: Router, private authService : AuthService, private bd: DataBaseService, private toastController: ToastController ) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
  }

  public login() {
    this.router.navigate(['/login'])
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000, 
      color: color
    });
    toast.present();
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

    let len1 = this.contraseñaValue.length;
    let len2 = this.contraseñaValue.length;

    const emailRegex = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);

    if (this.nombreValue == '') {
      this.mostrarToast('El campo Nombre no puede estar vacio', 'danger');
      return;
    }
    if (this.apellidoValue == '') {
      this.mostrarToast('El campo Apellido no puede estar vacio', 'danger');
      return;
    }

    if (this.correoValue == '') {
      this.mostrarToast('El campo Correo no puede estar vacio', 'danger');
      return;
    }
    if (!emailRegex.test(this.correoValue)) {
      this.mostrarToast('El formato del correo es incorrecto', 'danger');
      return;
    }



    if (this.preguntaValue == '') {
      this.mostrarToast('El campo Pregunta Secreta no puede estar vacio', 'danger');
      return;
    }
    if (this.respuestaValue == '') {
      this.mostrarToast('El campo Respuesta Secreta no puede estar vacio', 'danger');
      return;
    }


    if (this.contraseñaValue == '') {
      this.mostrarToast('El campo Contraseña no puede estar vacio', 'danger');
      return;
    }
    if (this.repeticionPasswordValue == '') {
      this.mostrarToast('El campo Repita su Contraseña no puede estar vacio', 'danger');
      return;
    }
    if (len1 < 4) {
      this.mostrarToast('Laa contraseña debe ser más de 4 caracteres', 'danger');
      return;
    }
    if (len2 < 4) {
      this.mostrarToast('Laa contraseña debe ser más de 4 caracteres', 'danger');
      return;
    }
    if (this.contraseñaValue !== this.repeticionPasswordValue) {
      this.mostrarToast('Las contraseñas no coinciden', 'danger');
      return;
    }



      await this.bd.crearUsuario(this.correoValue, this.contraseñaValue, this.nombreValue, this.apellidoValue, this.preguntaValue, this.respuestaValue, 'N')
      showToast('Su cuenta fue creada');
      this.router.navigate(['/login']);
  }
}

