import { test, expect } from '@playwright/test';

test.describe('IMDb - Nicolas Cage', () => {

  test('Primera pelicula completada en proximos estrenos', async ({ page }) => {

    // 1. Ir a IMDb
    await page.goto('https://www.imdb.com/');
    await page.waitForLoadState('domcontentloaded');

    // 2. Buscar a Nicolas Cage
    const buscador = page.getByTestId('suggestion-search');

    await expect(buscador).toBeVisible({ timeout: 15000 });
    await buscador.fill('Nicolas Cage');

    // 3. Hacer click en la sugerencia del perfil
    const sugerenciaNicolas = page
      .getByRole('link', { name: /Nicolas Cage/i })
      .first();

    await expect(sugerenciaNicolas).toBeVisible();

    await Promise.all([
      page.waitForNavigation(),
      sugerenciaNicolas.click(),
    ]);

    // 4. Validar que estamos en el perfil correcto
    await expect(page).toHaveURL(/nm0000115/);

    // 5. Ir a la seccion Credits
    const seccionCredits = page.getByRole('heading', { name: /^Credits$/i });

    await seccionCredits.scrollIntoViewIfNeeded();

    // 6. Abrir Upcoming / Proximos estrenos
    const upcomingTab = page.getByRole('button', { name: /Upcoming|Proximos estrenos/i }).first();

    await expect(upcomingTab).toBeVisible();
    const upcomingAbierto = await upcomingTab.getAttribute('aria-expanded');

    if (upcomingAbierto === 'false') {
      await upcomingTab.click();
    }

    // 7. Buscar la primera pelicula con estado Completed / Completada
    const estadoCompletado = page.getByRole('link', { name: /Completed|Completada/i }).first();

    await expect(
      estadoCompletado,
      'No se encontro ninguna pelicula con estado Completed/Completada en Upcoming'
    ).toBeVisible();

    const urlEstadoCompletado = await estadoCompletado.getAttribute('href');
    const idPelicula = urlEstadoCompletado?.match(/title\/(tt\d+)/)?.[1];

    expect(idPelicula, 'No se pudo obtener el ID de la pelicula completada').toBeTruthy();

    // 8. Hacer click en el titulo de esa pelicula
    const tituloPelicula = page.locator(`a[href^="/title/${idPelicula}/"]`).first();

    await expect(tituloPelicula).toBeVisible();

    await Promise.all([
      page.waitForNavigation(),
      tituloPelicula.click(),
    ]);

    // 9. Validar que se abrio una ficha de pelicula
    await expect(page).toHaveURL(/title/);

    // Pausa para revisar
    await page.pause();

  });

});
