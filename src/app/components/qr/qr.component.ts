import { CommonModule } from '@angular/common';
import { NgZone, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AlertController, AnimationController, IonicModule, ToastController } from '@ionic/angular';
import { Asistencia } from '../../model/asistencia';
import { Usuario } from '../../model/usuario';
import jsQR, { QRCode } from 'jsqr';
import { AuthService } from '../../services/auth.service.service';
import { DataBaseService } from '../../services/data-base.service';
import { SQLiteService } from '../../services/sqlite.service';
import { showAlertDUOC, showAlertYesNoDUOC } from '../../model/message';
import { BarcodeFormat, BarcodeScanner, ScanResult } from '@capacitor-mlkit/barcode-scanning';
import { MessageEnum } from '../../model/message-enum';


@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class QrComponent  implements OnInit, AfterViewInit {
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
  public datosQR: string = '';
  public datos = false;
  public plataforma: string = '';
  public usuario: Usuario | null = new Usuario();

  constructor(private activeroute: ActivatedRoute , 
    private router: Router , 
    private authService : AuthService, 
    private animationController: AnimationController, 
    private sqliteService: SQLiteService,
    private bd: DataBaseService,
    private readonly ngZone: NgZone) { }
  
  
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

  async ngOnInit() {
    this.plataforma = this.sqliteService.platform;
    this.authService.usuarioAutenticado.subscribe((usuario) => {
      this.usuario = usuario? usuario : new Usuario();
    });
  }

  async comenzarEscaneoQR() {
    if (this.plataforma === 'web') {
      this.comenzarEscaneoQRWeb();
    } else {
      this.comenzarEscaneoQRNativo();
    }
  }

  /**
   *  Proceso de escanéo de QR en un Navegador Web
   */

  public async comenzarEscaneoQRWeb() {
    const mediaProvider: MediaProvider = await navigator.mediaDevices.getUserMedia({
      video: {facingMode: 'environment'}
    });
    this.video.nativeElement.srcObject = mediaProvider;
    this.video.nativeElement.setAttribute('playsinline', 'true');
    this.video.nativeElement.play();
    this.escaneando = true;
    requestAnimationFrame(this.verificarVideo.bind(this));
  }

  async verificarVideo() {
    if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
      if (this.obtenerDatosQR() || !this.escaneando) return;
      requestAnimationFrame(this.verificarVideo.bind(this));
    } else {
      requestAnimationFrame(this.verificarVideo.bind(this));
    }
  }

  public obtenerDatosQR(): boolean {
    const w: number = this.video.nativeElement.videoWidth;
    const h: number = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    context.drawImage(this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    let qrCode: QRCode  | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
    if (qrCode) {
      const data = qrCode.data;
      if (data !== '') {
        this.escaneando = false;
        if (this.asistencia.verificarAsistenciaDesdeQR(qrCode.data)) {
          this.bd.asistencia = this.asistencia.obtenerAsistenciaDesdeQR(qrCode.data);
          this.bd.datosQR.next(qrCode.data);
          this.router.navigate(['/home/misclases']);
        } else {
          showAlertDUOC('El código QR escaneado no corresponde a una Asistencia de DUOC');
        }
        return true;
      }
    }
    return false;
  }

  public detenerEscaneoQR(): void {
    this.escaneando = false;
  }

  /**
   *  Proceso de escanéo de QR nativo en Android
   *  Ver: https://github.com/capawesome-team/capacitor-barcode-scanning
   */

  async comenzarEscaneoQRNativo() {
    const datosQR = await this.escanearQRNativo();
    if (datosQR === '') return;
    if (datosQR.includes('Error: ')) {
      showAlertDUOC(datosQR.substring(7));
      return;
    }

    if (this.asistencia.verificarAsistenciaDesdeQR(datosQR)) {
      this.bd.asistencia = this.asistencia.obtenerAsistenciaDesdeQR(datosQR);
      this.bd.datosQR.next(datosQR);
      this.router.navigate(['/home/misclases']);
    } else {
      showAlertDUOC('El código QR escaneado no corresponde a una Asistencia de DUOC');
    }
  }

  public async escanearQRNativo(): Promise<string> {
    try {
      await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable().then(async (result) => {
        if (!result.available) await BarcodeScanner.installGoogleBarcodeScannerModule();
      });

      if (!await BarcodeScanner.isSupported()) {
        return Promise.resolve('ERROR: Google Barcode Scanner no es compatible con este celular');
      }

      let status = await BarcodeScanner.checkPermissions();

      if (status.camera === 'denied') {
        status = await BarcodeScanner.requestPermissions();
      }
      
      if (status.camera === 'denied') {
        const resp = await showAlertYesNoDUOC('No fue posible otorgar permisos a la cámara. ¿Quiere '
          + 'acceder a las opciones de configuración de la aplicación y darle permiso manualmente?');
        if (resp === MessageEnum.YES) await BarcodeScanner.openSettings();
        return Promise.resolve('');
      }

      await BarcodeScanner.removeAllListeners().then(() => {
        BarcodeScanner.addListener('googleBarcodeScannerModuleInstallProgress', (event) => {
          this.ngZone.run(() => {
            console.log('googleBarcodeScannerModuleInstallProgress', event);
          });
        });
      });

      const { barcodes }: ScanResult = await BarcodeScanner.scan({ formats: [BarcodeFormat.QrCode],});
      return Promise.resolve(barcodes[0].displayValue);
      
    } catch(error: any) {
      if (error.message.includes('canceled')) return Promise.resolve('');
      console.log('ERROR EN escanearQRNativo CATCH ' + error.message);
      return Promise.resolve('ERROR: No fue posible leer el código QR');
    }
  }
  
}

