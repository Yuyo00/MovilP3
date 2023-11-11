import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationController, IonicModule, ToastController } from '@ionic/angular';
import { Asistencia } from 'src/app/model/asistencia';
import { showAlertDUOC, showToast } from 'src/app/model/message';
import { Usuario } from 'src/app/model/usuario';
import { AuthService } from 'src/app/services/auth.service.service';
import { DataBaseService } from 'src/app/services/data-base.service';

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
    private bd: DataBaseService) {
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

}
