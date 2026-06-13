import { test, expect } from '@playwright/test';

test.describe('IMDb - Breaking Bad', () => {

  test('Fotos Danny Trejo', async ({ page }) => {

    // 1. Ir a IMDb
    await page.goto('https://www.imdb.com/');
    await page.waitForLoadState('domcontentloaded');

    // 2. Abrir el menu
    const menu = page.getByText('Menu');

    await expect(menu).toBeVisible({ timeout: 15000 });
    await menu.click();

    // 3. Hacer click en Top 250 TV Shows
    const top250Shows = page.getByLabel(/Go to Top 250 TV shows|Las 250 mejores series/i, { exact: true });

    await expect(top250Shows).toBeVisible();

    await Promise.all([
      page.waitForURL(/chart\/toptv/),
      top250Shows.click(),
    ]);


    // 4. Hacer click en Breaking Bad
    const breakingBad = page.getByRole('link', { name: /View title page for Breaking Bad/i });
    await expect(breakingBad).toBeVisible();
    await Promise.all([
      page.waitForURL(/title\/tt0903747/),
      breakingBad.click(),
    ]);

    // 5. Abrir las fotos
    await page.getByTestId('photos-title').getByRole('link', { name: 'Photos' }).click();

    // 6. Ir a la galeria
    await Promise.all([
      page.waitForURL(/mediaindex/),
      page.getByTestId('mv-gallery-button').click(),
    ]);

    // 7. Abrir el filtro de imagenes
    const filtroFotos = page.getByTestId('image-chip-dropdown-test-id');

    await expect(filtroFotos).toBeVisible({ timeout: 15000 });
    await filtroFotos.click();

    // 8. Mostrar solo fotos de Danny Trejo
    const filtroNombres = page.getByTestId('image-names-filter-container-test-id');
    const comboNombres = filtroNombres.getByTestId('select-dropdown-test-id');

    await expect(comboNombres).toBeVisible({ timeout: 15000 });
    await comboNombres.selectOption('nm0001803');

    await expect(page.getByRole('button', { name: /Danny Trejo/i })).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: /Close Prompt|Cerrar/i }).click();
    await expect(page.getByRole('dialog')).toBeHidden();

    // 9. Hacer click en la segunda foto de la lista
    const segundaFoto = page.locator('main a[data-testid^="mosaic-img-"]').nth(1);

    await expect(segundaFoto).toBeVisible({ timeout: 15000 });
    await segundaFoto.click();

    await page.pause();

  });
});
