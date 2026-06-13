import { expect, test } from '@playwright/test';

test.describe('IMDb - Celebridades nacidas hoy hace 40 anios', () => {

  test('Buscar celebridades y abrir primer enlace de descripcion', async ({ page }, testInfo) => {

    // 1. Ir a IMDb
    await page.goto('https://www.imdb.com/');
    await page.waitForLoadState('domcontentloaded');

    // 2. Abrir el menu
    const menu = page.getByText('Menu');

    await expect(menu).toBeVisible({ timeout: 15000 });
    await menu.click();

    // 3. Entrar a Born Today
    const bornToday = page.getByLabel(/Go to Born Today|Nacidos hoy/i, { exact: true });

    await expect(bornToday).toBeVisible();
    await bornToday.click();

    await expect(page).toHaveURL(/search\/name/);
    await expect(page.getByRole('heading', { name: /Advanced name search/i })).toBeVisible();

    // 4. Quitar el filtro que viene por defecto
    const filtroCumpleanosActual = page.getByRole('button', { name: /Birthday:/i });

    await expect(filtroCumpleanosActual).toBeVisible();
    await filtroCumpleanosActual.click();

    // 5. Abrir el filtro Birth date
    const filtroFechaNacimiento = page.getByRole('button', { name: /Expand Birth date|Fecha de nacimiento/i });

    await expect(filtroFechaNacimiento).toBeVisible();
    await filtroFechaNacimiento.click();

    // 6. Calcular la fecha de hoy, pero 40 anios atras
    const fechaHace40Anios = new Date();
    fechaHace40Anios.setFullYear(fechaHace40Anios.getFullYear() - 40);

    const fechaNacimiento = [
      fechaHace40Anios.getFullYear(),
      String(fechaHace40Anios.getMonth() + 1).padStart(2, '0'),
      String(fechaHace40Anios.getDate()).padStart(2, '0'),
    ].join('-');

    // 7. Usar el selector de fecha para Desde
    const fechaDesde = page.getByTestId('birthDate-start');

    await expect(fechaDesde).toBeVisible();
    await fechaDesde.fill(fechaNacimiento);

    // 8. Usar el campo de texto para Hasta
    const fechaHasta = page.getByTestId('birthDate-end');

    await expect(fechaHasta).toBeVisible();
    await fechaHasta.fill(fechaNacimiento);
    await fechaHasta.press('Enter');

    // 9. Buscar resultados
    const botonVerResultados = page.getByRole('button', { name: /See results|Ver resultados/i });

    await expect(botonVerResultados).toBeEnabled({ timeout: 15000 });
    await botonVerResultados.click();

    await expect(page).toHaveURL(/search\/name/);
    await expect(page.locator('main a[href*="ref_=sr_t_"]').first()).toBeVisible({ timeout: 15000 });

    // 10. Hacer click en el primer enlace de la descripcion del primer resultado
    const primerEnlaceDescripcion = page.locator('main a[href$="?ref_=sr"]').first();

    await expect(primerEnlaceDescripcion, 'El primer resultado no tiene enlaces en la descripcion').toBeVisible();
    await primerEnlaceDescripcion.click();

    // 11. Tomar captura de pantalla
    await page.screenshot({
      path: testInfo.outputPath('primer-enlace-descripcion.png'),
      fullPage: true,
    });

  });

});
