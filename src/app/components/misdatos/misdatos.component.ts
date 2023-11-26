import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationController, IonicModule, ToastController } from '@ionic/angular';
import { Asistencia } from '../../model/asistencia';
import { showAlertDUOC, showToast } from '../../model/message';
import { Usuario } from '../../model/usuario';
import { AuthService } from '../../services/auth.service.service';
import { DataBaseService } from '../../services/data-base.service';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.component.html',
  styleUrls: ['./misdatos.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MisdatosComponent  implements OnInit, AfterViewInit{
  public asistencia: Asistencia = new Asistencia();
  public usuario: Usuario;
  public repeticionPassword: string = '';
  @ViewChild('Bienvenida', { read: ElementRef }) itemBienvenida!: ElementRef;
  @ViewChild('Nombre', { read: ElementRef }) itemNombreTit!: ElementRef;

  constructor( 
    private authService : AuthService, 
    private activeroute: ActivatedRoute , 
    private router: Router, 
    private animationController: AnimationController,
    private bd: DataBaseService,
    private alertController: AlertController,
    private toastController: ToastController
    ) {
    this.usuario = new Usuario();
    
    this.activeroute.queryParams.subscribe(params => { 
      const nav = this.router.getCurrentNavigation();

      if (nav) {
        // Si tiene datos extra, se rescatan y se asignan a una propiedad
        if (nav.extras.state) {
          this.usuario = nav.extras.state['usuario'];
          this.asistencia = nav.extras.state['asistencia'];
          return;
        }
      }
      this.router.navigate(['/login']);
    });
  }
  ngAfterViewInit(): void {
    if (this.itemNombreTit) {
      const animation = this.animationController
        .create()
          .addElement(this.itemNombreTit.nativeElement)
          .iterations(7)
          .duration(400)
          .fromTo('transform', 'scale3d(1,1,1)', 'scale')
          .fromTo("opacity",0.2,1)
          ;
        animation.play();
      }
    if (this.itemBienvenida) {
      const animation = this.animationController
        .create()
          .addElement(this.itemBienvenida.nativeElement)
          .iterations(7)
          .duration(400)
          .fromTo('transform', 'scale3d(1,1,1)', 'scale')
          .fromTo('color','white','orange')
          .fromTo("opacity",0.2,1)
          ;
        animation.play();
      }
  }
  
  async DatosStorage() {
    const Datos = await this.authService.leerUsuarioAutenticado()
    if (Datos) {
      this.usuario.setUsuario(Datos.correo, Datos.password, Datos.nombre, Datos.apellido, Datos.preguntaSecreta, Datos.respuestaSecreta, Datos.sesionActiva)
    } else {
      console.log('Error :(')
    }
  }

  ngOnInit() {
    this.DatosStorage();
  }

  validarCampo(nombreCampo:string, valor: string) {
    if (valor.trim() === '') {
      showAlertDUOC(`Debe ingresar un valor para el campo "${nombreCampo}".`);
      return false;
    }
    return true;
  }

  async actualizarPerfil() {
    if (!this.validarCampo('nombre', this.usuario.nombre)) return;
    if (!this.validarCampo('apellidos', this.usuario.apellido)) return;
    if (!this.validarCampo('correo', this.usuario.correo)) return;
    if (!this.validarCampo('pregunta secreta', this.usuario.preguntaSecreta)) return;
    if (!this.validarCampo('respuesta secreta', this.usuario.respuestaSecreta)) return;
    if (!this.validarCampo('contraseña', this.usuario.password)) return;
    if (this.usuario.password !== this.repeticionPassword) {
      showAlertDUOC(`Las contraseñas escritas deben ser iguales.`);
      return;
    }
    await this.bd.guardarUsuario(this.usuario);
    this.authService.guardarUsuarioAutenticado(this.usuario);
    showToast('Sus datos fueron actualizados');
  }
  async cambiarContrasena() {
    const alert = await this.alertController.create({
      header: 'Cambiar Contraseña',
      inputs: [
        {
          name: 'contrasenaActual',
          type: 'password',
          placeholder: 'Contraseña Actual'
        },
        {
          name: 'nuevaContrasena',
          type: 'password',
          placeholder: 'Nueva Contraseña'
        },
        {
          name: 'repetirContrasena',
          type: 'password',
          placeholder: 'Repetir Contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            try {
              if (!data.nuevaContrasena || !data.repetirContrasena) {
                throw new Error('Las contraseñas no pueden estar vacías');
              }
              if (data.nuevaContrasena !== data.repetirContrasena) {
                throw new Error('Las contraseñas no coinciden');
              }
              await this.bd.cambiarContrasena(
                this.usuario.correo,
                data.contrasenaActual,
                data.nuevaContrasena,
                data.repetirContrasena
              );

              this.mostrarToast('Contraseña cambiada exitosamente', 'success');
            } catch (error) {
              if (data.contrasenaActual !== this.usuario.password) {
                this.mostrarToast('Contraseña actual incorrecta', 'danger');
              } else if (data.nuevaContrasena !== data.repetirContrasena) {
                this.mostrarToast('Las contraseñas no coinciden', 'danger');
              } else if (data.nuevaContrasena.trim() || data.repetirContrasena.trim() === '' ){
                this.mostrarToast('Las contraseñas no pueden ser vacias', 'danger');
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000, 
      color: color
    });
    toast.present();
  }
  

}
