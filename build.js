import { promises as fs } from 'fs';
import { resolve } from 'path';

async function copyPublicFiles() {
  try {
    // Ensure dist directory exists
    await fs.mkdir('dist', { recursive: true });
    await fs.mkdir('dist/assets', { recursive: true });
    await fs.mkdir('dist/icons', { recursive: true });

    // Copy manifest.json
    await fs.copyFile(
      resolve('public', 'manifest.json'),
      resolve('dist', 'manifest.json')
    );

    // Copy icons
    const iconFiles = await fs.readdir(resolve('public', 'icons'));
    for (const icon of iconFiles) {
      await fs.copyFile(
        resolve('public', 'icons', icon),
        resolve('dist', 'icons', icon)
      );
    }

    // Copy and update popup.html
    let popupHtml = await fs.readFile(resolve('public', 'popup.html'), 'utf-8');
    popupHtml = popupHtml.replace(
      'href="assets/styles.css"',
      'href="./assets/styles.css"'
    );
    await fs.writeFile(resolve('dist', 'popup.html'), popupHtml);

    console.log('Successfully copied public files to dist');
  } catch (error) {
    console.error('Error copying files:', error);
    process.exit(1);
  }
}

copyPublicFiles();
