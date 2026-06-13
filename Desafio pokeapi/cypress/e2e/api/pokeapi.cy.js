// Se agrupan las pruebas relacionadas con berries para mantener el spec ordenado.
describe('PokeAPI - Berry', () => {

  it('obtiene una berry con ID valido', () => {
    // Se consulta el endpoint usando un ID conocido.
    cy.request('/berry/1').then((response) => {
      cy.log(`Status recibido: ${response.status}`);
      cy.log(`ID recibido: ${response.body.id}`);
      cy.log(`Nombre recibido: ${response.body.name}`);

      console.log('Respuesta completa de /berry/1:', response.body);

      // Primero se valida el status y luego los datos principales de la respuesta.
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(1);
      expect(response.body.name).to.eq('cheri');
    });
  });

  it('muestra error al llamar una berry con ID no valido', () => {
    // failOnStatusCode permite validar manualmente respuestas de error como 404.
    cy.request({
      url: '/berry/999999',
      failOnStatusCode: false,
    }).then((response) => {
      cy.log(`Status recibido: ${response.status}`);
      cy.log(`Mensaje recibido: ${response.body}`);

      console.log('Respuesta completa de /berry/999999:', response.body);

      // Se valida que la API indique que el recurso no existe.
      expect(response.status).to.eq(404);
      expect(response.body).to.eq('Not Found');
    });
  });

  it('obtiene una berry con nombre valido', () => {
    // Se consulta el mismo recurso usando nombre en vez de ID.
    cy.request('/berry/cheri').then((response) => {
      cy.log(`Status recibido: ${response.status}`);
      cy.log(`ID recibido: ${response.body.id}`);
      cy.log(`Nombre recibido: ${response.body.name}`);

      console.log('Respuesta completa de /berry/cheri:', response.body);

      // Se valida que el nombre devuelto corresponda al solicitado.
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(1);
      expect(response.body.name).to.eq('cheri');
    });
  });

  it('muestra error al llamar una berry con nombre no valido', () => {
    // Se usa un nombre inexistente para comprobar el manejo de errores.
    cy.request({
      url: '/berry/berry-inexistente',
      failOnStatusCode: false,
    }).then((response) => {
      cy.log(`Status recibido: ${response.status}`);
      cy.log(`Mensaje recibido: ${response.body}`);

      console.log('Respuesta completa de /berry/berry-inexistente:', response.body);

      // La API debe responder 404 cuando el nombre no existe.
      expect(response.status).to.eq(404);
      expect(response.body).to.eq('Not Found');
    });
  });

  it('obtiene un berry flavor con nombre valido', () => {
    // Se consulta el sabor spicy para obtener sus bayas relacionadas.
    cy.request('/berry-flavor/spicy').then((response) => {
      cy.log(`Status recibido: ${response.status}`);
      cy.log(`Sabor recibido: ${response.body.name}`);
      cy.log(`Cantidad de bayas: ${response.body.berries.length}`);

      console.log('Respuesta completa de /berry-flavor/spicy:', response.body);

      // Se comprueba que el sabor exista y que tenga bayas asociadas.
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(1);
      expect(response.body.name).to.eq('spicy');
      expect(response.body.berries).to.be.an('array').and.not.be.empty;
    });
  });

  it('busca la baya picante con mayor potencia y consulta su detalle', () => {
    // Primero se obtiene la lista de bayas con sabor spicy.
    cy.request('/berry-flavor/spicy').then((flavorResponse) => {
      expect(flavorResponse.status).to.eq(200);
      expect(flavorResponse.body.name).to.eq('spicy');

      const spicyBerries = flavorResponse.body.berries;

      // reduce recorre la lista y conserva la baya con mayor potency.
      const strongestBerry = spicyBerries.reduce((highest, current) => {
        return current.potency > highest.potency ? current : highest;
      });

      // Se guarda el nombre para reutilizarlo en la siguiente peticion.
      const berryName = strongestBerry.berry.name;

      cy.log(`Baya con mayor potencia picante: ${berryName}`);
      cy.log(`Potencia picante: ${strongestBerry.potency}`);

      console.log('Baya picante con mayor potencia:', strongestBerry);

      // Luego se consulta el detalle de la baya encontrada.
      cy.request(`/berry/${berryName}`).then((berryResponse) => {
        cy.log(`Status recibido: ${berryResponse.status}`);
        cy.log(`Nombre recibido: ${berryResponse.body.name}`);

        console.log(`Respuesta completa de /berry/${berryName}:`, berryResponse.body);

        // Se busca dentro del detalle el sabor spicy para comparar su potency.
        const spicyFlavor = berryResponse.body.flavors.find((flavor) => {
          return flavor.flavor.name === 'spicy';
        });

        // Se confirma que el detalle corresponde a la baya encontrada anteriormente.
        expect(berryResponse.status).to.eq(200);
        expect(berryResponse.body.name).to.eq(berryName);
        expect(spicyFlavor).to.exist;
        expect(spicyFlavor.potency).to.eq(strongestBerry.potency);
      });
    });
  });

});
