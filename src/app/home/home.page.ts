import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataBaseService } from '../services/data-base.service';
import { AnimationController} from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { Asistencia } from 'src/app/model/asistencia';
import { AfterViewInit, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router , NavigationExtras} from '@angular/router';
import { AuthService } from '../services/auth.service.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class HomePage implements OnInit, AfterViewInit {
  bloquear: boolean = true;
  @ViewChild('Nombre', { read: ElementRef }) itemNombreTit!: ElementRef;
  @ViewChild('Bienvenida', { read: ElementRef }) itemBienvenida!: ElementRef;
  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;
  
  @ViewChild('itemNombre', { read: ElementRef }) itemNombre!: ElementRef;
  @ViewChild('itemApellido', { read: ElementRef }) itemApellido!: ElementRef;
  @ViewChild('video')
  private video!: ElementRef;

  @ViewChild('canvas')
  private canvas!: ElementRef;

  public asistencia: Asistencia = new Asistencia();
  public escaneando = false;
  public usuario: Usuario | null = new Usuario();
  public datos = false;
  public componenteActual = 'qr';

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private animationController: AnimationController,
    private bd: DataBaseService,) 
  {
  }
    
  public ngOnInit(): void {
    this.authService.usuarioAutenticado.subscribe((usuario) => {
      this.usuario = usuario;
    });
    this.bd.datosQR.subscribe((datosQR) => {
      this.componenteActual = 'misclases';
    });
    this.authService.primerInicioSesion.subscribe((primerInicioSesion) => {
      if (primerInicioSesion) {
        this.componenteActual = 'qr';
      }
    });
  }

  public logOff(): void{
    this.router.navigate(['/login'])
  }

  public ngAfterViewInit(): void {
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
          .fromTo('color','orange','white')
          .fromTo("opacity",1,0.2)
          ;
        animation.play();
      }
    if (this.itemTitulo) {
    const animation = this.animationController
      .create()
        .addElement(this.itemTitulo.nativeElement)
        .iterations(Infinity)
        .duration(6000)
        .fromTo('transform', 'translate(0%)', 'translate(100%)')
        ;
      animation.play();
    }
  }
    
  public animateItem(elementRef: any) {
    this.animationController
      .create()
      .addElement(elementRef)
      .iterations(1)
      .duration(600)
      .fromTo('transform', 'translate(100%)', 'translate(0%)')
      .play();
  }
    
  segmentChanged(event: any) {
    this.router.navigate(['home/'+ event.detail.value]);
  }

  cerrarSesion() {
    this.bd.asistencia = new Asistencia();
    this.authService.logout();
  }
}