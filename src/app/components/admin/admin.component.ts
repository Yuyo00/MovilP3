import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnimationController, IonicModule } from '@ionic/angular';
import { Usuario } from '../../model/usuario';
import { AuthService } from '../../services/auth.service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseService } from '../../services/data-base.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminComponent  implements OnInit {
    public usuario: Usuario;
    constructor(private authService : AuthService, 
    private activeroute: ActivatedRoute , 
    private router: Router, 
    private animationController: AnimationController,
    public bd: DataBaseService,
    private alertController: AlertController) { 
     {
      this.bd =bd;
    this.usuario = new Usuario();
    
    this.activeroute.queryParams.subscribe(params => { 
      const nav = this.router.getCurrentNavigation();
      if (nav) {
        if (nav.extras.state) {
          this.usuario = nav.extras.state['usuario'];
          return;
        }
      }
      this.router.navigate(['/login']);
    });
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
  async eliminarUsuario(usuario: Usuario) {
    const confirmar = await this.confirmarEliminarUsuario(usuario.nombre); 

    if (confirmar) {
      await this.bd.eliminarUsuarioUsandoCorreo(usuario.correo);
      console.log(`Usuario ${usuario.nombre} eliminado.`);
    }
  }

  async confirmarEliminarUsuario(nombreUsuario: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Confirmar eliminación',
        message: `¿Estás seguro de que quieres eliminar a ${nombreUsuario}?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(false),
          },
          {
            text: 'Eliminar',
            handler: () => resolve(true),
          },
        ],
      });

      await alert.present();
    });
  }

}
