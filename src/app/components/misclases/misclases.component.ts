import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, AnimationController, IonicModule, ViewWillEnter } from '@ionic/angular';
import { Asistencia } from 'src/app/model/asistencia';
import { AuthService } from 'src/app/services/auth.service.service';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-misclases',
  templateUrl: './misclases.component.html',
  styleUrls: ['./misclases.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MisclasesComponent  implements OnInit, ViewWillEnter {
  public asistencia: Asistencia = new Asistencia();
  public escaneando = false;
  public datosQR: string = '';
  public datos: any;

  constructor(private authService : AuthService, 
    private activeroute: ActivatedRoute, 
    private router: Router, 
    private animationController: AnimationController,
    private bd: DataBaseService) { 
  }

  ngOnInit() {
  }

  ionViewWillEnter(): void {
    this.asistencia = this.bd.asistencia;
  }

  public logOff(): void{
    this.authService.logout();
    this.router.navigate(['/login'])
  }
  public mostrarDatosQROrdenados(datosQR: string): void {
    this.datosQR = datosQR;
    const objetoDatosQR = JSON.parse(datosQR);
    this.asistencia.setAsistencia(objetoDatosQR.bloqueInicio,objetoDatosQR.bloqueTermino,objetoDatosQR.dia,objetoDatosQR.horaFin,objetoDatosQR.horaInicio, objetoDatosQR.idAsignatura, objetoDatosQR.nombreAsignatura,objetoDatosQR.nombreProfesor,objetoDatosQR.seccion,objetoDatosQR.sede);
  }
}
