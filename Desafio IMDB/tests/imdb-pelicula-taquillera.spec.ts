import { test, expect } from '@playwright/test';

test.describe('IMDb - Peliculas', () => {

  test('Peliculas mas taquilleras - abrir segunda pelicula y hacer click en Rate', async ({ page }) => {

    // 1. Ir a IMDb
    await page.goto('https://www.imdb.com/');
    await page.waitForLoadState('domcontentloaded');

    // 2. Abrir el menu
    const menu = page.getByText('Menu');

    await expect(menu).toBeVisible({ timeout: 15000 });
    await menu.click();

    // 3. Hacer click en Top Box Office
    const topBoxOffice = page.getByLabel(/Go to Top Box Office|Taquilla superior/i, { exact: true });

    await expect(topBoxOffice).toBeVisible();

    await Promise.all([
      page.waitForNavigation(),
      topBoxOffice.click(),
    ]);

    // 4. Validar que se abrio la pagina de Top Box Office
    await expect(page).toHaveURL(/chart\/boxoffice/);
    await expect(page.getByRole('heading', { name: /Top box office/i })).toBeVisible();

    // 5. Buscar la segunda pelicula de la lista
    const segundaPelicula = page.locator('main a[href*="ref_=chtbo_t_"]').nth(1);

    await expect(segundaPelicula).toBeVisible();

    const nombrePelicula = (await segundaPelicula.textContent())?.trim() ?? '';
    console.log('Segunda pelicula:', nombrePelicula);

    // 6. Hacer click en la segunda pelicula
    await Promise.all([
      page.waitForNavigation(),
      segundaPelicula.click(),
    ]);

    // 7. Validar que se abrio una pagina de pelicula
    await expect(page).toHaveURL(/title/);

    // 8. Guardar el titulo de la pelicula
    const tituloLocator = page.getByTestId('hero__primary-text');

    await expect(tituloLocator).toBeVisible();

    const titulo = (await tituloLocator.textContent())?.trim() ?? '';
    expect(titulo, 'El titulo de la pelicula no debe estar vacio').not.toBe('');
    console.log('Titulo en la pagina de detalle:', titulo);

    // 9. Hacer click en el boton Rate usando el titulo guardado
    const botonRate = page
      .getByTestId('hero-parent')
      .getByRole('button', { name: `Rate ${titulo}` });

    await expect(botonRate).toBeVisible();
    await botonRate.click();

    // 10. Seleccionar 5 estrellas en la ventana emergente
    const ventanaCalificar = page.getByRole('dialog');

    await expect(ventanaCalificar).toBeVisible();

    const cincoEstrellas = ventanaCalificar.getByRole('button', { name: /Rate 5|Calificar 5|5/i }).first();

    await expect(cincoEstrellas).toBeVisible();
    await cincoEstrellas.click({ force: true });

    // 11. Hacer click en el boton Calificar de la ventana emergente
    const botonCalificar = ventanaCalificar.getByRole('button', { name: /^Rate$|^Calificar$/i });

    await expect(botonCalificar).toBeVisible();
    await expect(botonCalificar).toBeEnabled({ timeout: 15000 });
    await botonCalificar.click();

    // Pausa para revisar
    await page.pause();

  });

});
