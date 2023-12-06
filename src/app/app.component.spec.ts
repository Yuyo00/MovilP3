import { Usuario } from './model/usuario';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { activeAnimations } from '@ionic/core/dist/types/utils/overlays';
import { AppComponent } from './app.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';


describe('Probar comienzo de la aplicacion', () => {

  beforeEach(async () => {
    await TestBed.overrideComponent(AppComponent, { set: {
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({get:(key: string) => 'mockedParamValue' }),
          },
        },
      ],
    }}).compileComponents();
  });

  it('Se debería crear la aplicación', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});

describe('Probar clase usuario', () => {
  const usuario = new Usuario();
  usuario.setUsuario('atorres@duocuc.cl', '1234', 'Ana', 'Torres', 'Nombre de mi mascota', 'gato', 'N');


  it('Probar función de obtener datos de usuario', () => {
    const datosUsuario = usuario.getDatosUsuario();
    expect(datosUsuario).toEqual([
      'atorres@duocuc.cl',
      '1234',
      'Ana',
      'Torres',
      'Nombre de mi mascota',
      'gato',
      'N'
    ]);
  });

  it ('Probar que la contraseña sea 1234" ', () => {
    usuario.password = '1234';
    expect(usuario.validarPassword(usuario.password)).toEqual('');
  });

  it('Probar que la password no sea vacia', () => {
    usuario.password = '';
    expect(usuario.validarPassword(usuario.password)).toContain('Para entrar al sistema debe ingresar la contraseña.');
  });


  

  it('Probar que el correo no sea vacío', () => {
    usuario.correo = '';
    expect(usuario.validarCorreo(usuario.correo)).toContain('Para ingresar al sistema debe ingresar el correo del usuario.');
  });

  

});