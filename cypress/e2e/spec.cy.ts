describe('Verificar app', () => {
  it('Verificar login con credenciales incorrectas', () => {
    cy.visit('http://localhost:8100').then(()=>{
      cy.get('#correoLogin').type('{selectall}{backspace}');
      cy.get('#correoLogin').invoke('val','yuyu@duocuc.cl');
      cy.get('#passLogin').type('{selectall}{backspace}');
      cy.get('#passLogin').invoke('val','123');
      cy.contains('Ingresar').click().then(()=>{
        cy.wait(1000);
        cy.url().should('include', '/login');
      });
    });
  });

  it('Verificar login con credenciales correctas', () => {
    cy.visit('http://localhost:8100').then(()=>{
      cy.get('#correoLogin').invoke('val','');
      cy.get('#correoLogin').type('atorres@duocuc.cl');
      cy.get('#passLogin').invoke('val','');
      cy.get('#passLogin').type('1234');
      cy.contains('Ingresar').click().then(()=>{
        cy.wait(1000);
        cy.url().should('include', '/home');
        cy.get('#cerrarSesion').click();
      });
    });
  });

  it('Verificar publicar en el foro', () => {
    cy.visit('http://localhost:8100').then(()=>{
    cy.contains('Ingresar').click();
    cy.get('#foro').click().then(()=>{
      cy.wait(1000);
      cy.get('#seleccionUsuario').click().then(()=>{
        cy.contains('.alert-radio-label', 'Leanne Graham').click().then(()=>{
          cy.contains('button','OK').click().then(()=>{
            cy.wait(1000);
            cy.get('#tituloPublicacion').invoke('val','');
            cy.get('#tituloPublicacion').type('Publicacion de prueba');
            cy.get('#contenidoPublicacion').invoke('val','');
            cy.get('#contenidoPublicacion').type('Contenido de prueba uwu');
            cy.get('#crearPublicacion').click().then(()=>{
              cy.contains('Publicacion de prueba');
              cy.get('#cerrarSesion').click();
              });
            });

          });
        });
      });
    });
  });

  it('Eliminar ultima publicación hecha', () => {
    cy.visit('http://localhost:8100').then(() => {
      cy.contains('Ingresar').click();
      cy.get('#foro').click().then(()=>{
        cy.wait(2000);
        cy.get('.eliminar-btn').first().click();
        cy.get('#cerrarSesion').click();
      });
    });
  });

  it('Validacion campos misDatos', () => {
    cy.visit('http://localhost:8100').then(() => {
      cy.contains('Ingresar').click();
      cy.get('#misdatos').click().then(()=>{
        cy.get('#nombre').invoke('val','');
        cy.get('#nombre').type(' ');
        cy.get('#actualizar').click().then(()=>{
          cy.get('.alert-wrapper').should('be.visible');
          cy.wait(2000);
          cy.get('.alert-message').should('include.text', 'Debe ingresar un valor para el campo "nombre"', { timeout: 1000 });
          cy.get('.alert-button').click();
          
        });
        cy.get('#nombre').type('Ana');
        cy.get('#apellido').invoke('val','');
        cy.get('#apellido').type(' ');
        cy.get('#actualizar').click().then(()=>{
          cy.get('.alert-wrapper').should('be.visible');
          cy.wait(2000);
          cy.get('.alert-message').should('include.text', 'Debe ingresar un valor para el campo "apellidos"', { timeout: 1000 });
          cy.get('.alert-button').click();
          
        });
        cy.get('#apellido').type('Torres');
        cy.get('#correo').invoke('val','');
        cy.get('#correo').type(' ');
        cy.get('#actualizar').click().then(()=>{
          cy.get('.alert-wrapper').should('be.visible');
          cy.wait(2000);
          cy.get('.alert-message').should('include.text', 'Debe ingresar un valor para el campo "correo"', { timeout: 1000 });
          cy.get('.alert-button').click();
          
        });
        cy.get('#correo').type('atorres@duocuc.cl');
        cy.get('#pregunta').invoke('val','');
        cy.get('#pregunta').type(' ');
        cy.get('#actualizar').click().then(()=>{
          cy.get('.alert-wrapper').should('be.visible');
          cy.wait(2000);
          cy.get('.alert-message').should('include.text', 'Debe ingresar un valor para el campo "pregunta secreta"', { timeout: 1000 });
          cy.get('.alert-button').click();
          
        });
        cy.get('#pregunta').type('Nombre de mi mascota');
        cy.get('#respuesta').invoke('val','');
        cy.get('#respuesta').type(' ');
        cy.get('#actualizar').click().then(()=>{
          cy.get('.alert-wrapper').should('be.visible');
          cy.wait(2000);
          cy.get('.alert-message').should('include.text', 'Debe ingresar un valor para el campo "respuesta secreta"', { timeout: 1000 });
          cy.get('.alert-button').click();
          
        });
        cy.get('#respuesta').type('gato');
        cy.get('#password').invoke('val','');
        cy.get('#password').type(' ');
        cy.get('#actualizar').click().then(()=>{
          cy.get('.alert-wrapper').should('be.visible');
          cy.wait(2000);
          cy.get('.alert-message').should('include.text', 'Debe ingresar un valor para el campo "contraseña"', { timeout: 1000 });
          cy.get('.alert-button').click();
          
        });
        cy.get('#password').invoke('val','');
        cy.get('#password').type('1234');

        cy.get('#actualizar').click().then(()=>{
          cy.get('.alert-wrapper').should('be.visible');
          cy.wait(2000);
          cy.get('.alert-message').should('include.text', 'Las contraseñas escritas deben ser iguales', { timeout: 1000 });
          cy.get('.alert-button').click();
          
        });
        cy.get('#cerrarSesion').click();



      });
    });
  });

  it('Verificar actualizar datos', () => {
    cy.visit('http://localhost:8100').then(() => {
      cy.contains('Ingresar').click();
      cy.get('#misdatos').click().then(()=>{
        cy.get('#nombre').invoke('val','');
        cy.get('#nombre').type('Juana');
        cy.get('#password2').type('1234');
        cy.get('#actualizar').click()
      });
      cy.get('#qr').click().then(()=>{
        cy.get('#saludo').should('include.text', 'Juana Torres');
        cy.get('#cerrarSesion').click();
      });
    });
  });



});