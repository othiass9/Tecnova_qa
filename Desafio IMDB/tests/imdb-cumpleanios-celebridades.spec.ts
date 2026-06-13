import { expect, test } from '@playwright/test';

test.describe('IMDb - Cumpleanios de celebridades', () => {

  test('Buscar celebridades nacidas ayer', async ({ page }) => {

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

    // 5. Abrir el filtro Birthday
    const filtroBirthday = page.getByRole('button', { name: /Expand Birthday|Cumple/i });

    await expect(filtroBirthday).toBeVisible();
    await filtroBirthday.click();

    // 6. Calcular la fecha de ayer en formato MM-DD
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);

    const cumpleanosAyer = [
      String(ayer.getMonth() + 1).padStart(2, '0'),
      String(ayer.getDate()).padStart(2, '0'),
    ].join('-');

    // 7. Escribir la fecha de ayer en el campo Birthday
    const campoCumpleanos = page.getByRole('textbox', { name: /Enter birthday|Cumple/i });

    await expect(campoCumpleanos).toBeVisible();
    await campoCumpleanos.fill(cumpleanosAyer);
    await campoCumpleanos.press('Enter');

    // 8. Buscar celebridades nacidas ayer
    const botonVerResultados = page.getByRole('button', { name: /See results|Ver resultados/i });

    await expect(botonVerResultados).toBeEnabled({ timeout: 15000 });

    await Promise.all([
      page.waitForURL(new RegExp(`birth_monthday=${cumpleanosAyer}`)),
      botonVerResultados.click(),
    ]);

    // 9. Validar que el filtro quedo aplicado
    await expect(page.getByRole('button', { name: new RegExp(`Birthday: ${cumpleanosAyer}`) })).toBeVisible();

    await page.pause();

  });

});
