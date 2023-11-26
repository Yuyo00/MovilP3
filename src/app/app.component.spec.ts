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

  it('Probar que el titulo de la App "Asistencia Duoc"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    alert(app.title);
    expect(app.title).toEqual('Asistencia Duoc');
  });

});

describe('Probar la clase de usuario /', () => {
  const usuario = new Usuario();
  usuario.setUsuario('atorres@duocuc.cl', '1234', 'Ana', 'Torres', 'Nombre de mi mascota', 'gato', 'N');

  it('Probar que la contraseña no sea vacía', () => {
    usuario.password = '';
    expect(usuario.validarPassword(usuario.password)).toContain('ingresar la contraseña');
  });

  it ('Probar que la contraseña sea numérica y no "tboi"', () => {
      usuario.password = 'tboi';
      expect(usuario.validarPassword(usuario.password)).toContain('La contraseña debe ser numérica.');
    });
  
  it ('Probar que la contraseña no supere los 4 dígitos ', () => {
    usuario.password = '9876543210';
    expect(usuario.validarPassword(usuario.password)).toContain('La contraseña debe ser numérica de 4 dígitos.');
  });

  it ('Probar que la contraseña sea de 4 dígitos como por ejemplo "1234" ', () => {
    usuario.password = '1234';
    expect(usuario.validarPassword(usuario.password)).toEqual('');
  });

});