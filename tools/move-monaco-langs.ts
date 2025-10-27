import * as fs from 'node:fs';
import * as path from 'node:path';

// Конфигурация путей
const SOURCE_DIR = path.join(path.dirname(__dirname), 'node_modules', 'monaco-editor', 'esm', 'vs');
const TARGET_DIR = path.join(path.dirname(__dirname), 'public', 'monaco-editor');

// Языки для копирования (можно настроить)
const LOCALES = [
  'de',
  'es',
  'fr',
  'it',
  'ja',
  'ko',
  'ru',
  'zh-cn',
  'zh-tw',
  'pt-br',
  'tr',
  'pl',
  'cs'
];

/**
 * Рекурсивное создание директории
 */
function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Создана директория: ${dirPath}`);
  }
}

/**
 * Копирование файла
 */
function copyFile(source: string, target: string): void {
  try {
    const targetDir = path.dirname(target);
    ensureDirectoryExists(targetDir);
    fs.copyFileSync(source, target);
    console.log(`✓ Скопирован: ${path.relative(__dirname, target)}`);
  } catch (error) {
    console.error(`✗ Ошибка копирования ${source}:`, error);
  }
}

/**
 * Рекурсивное копирование директории
 */
function copyDirectory(source: string, target: string): void {
  if (!fs.existsSync(source)) {
    console.warn(`⚠ Директория не найдена: ${source}`);
    return;
  }

  ensureDirectoryExists(target);

  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else if (entry.isFile()) {
      copyFile(sourcePath, targetPath);
    }
  }
}

/**
 * Основная функция копирования локализации
 */
function copyMonacoLocales(): void {
  console.log('🚀 Начало копирования локализации Monaco Editor...\n');

  // Проверка существования исходной директории
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`✗ Исходная директория не найдена: ${SOURCE_DIR}`);
    console.error('Убедитесь, что monaco-editor установлен в node_modules');
    process.exit(1);
  }

  // Создание целевой директории
  ensureDirectoryExists(TARGET_DIR);

  // Копирование базовых файлов Monaco Editor
  console.log('📦 Копирование базовых файлов...');
  const basicPaths = [
    'base',
    'editor',
    'language',
    'platform'
  ];

  for (const basicPath of basicPaths) {
    const sourcePath = path.join(SOURCE_DIR, basicPath);
    const targetPath = path.join(TARGET_DIR, basicPath);
    
    if (fs.existsSync(sourcePath)) {
      copyDirectory(sourcePath, targetPath);
    }
  }

  // Копирование файлов локализации
  console.log('\n🌍 Копирование файлов локализации...');
  
  for (const locale of LOCALES) {
    const localeSourcePath = path.join(
      __dirname,
      'node_modules',
      'monaco-editor',
      'esm',
      'vs',
      'editor',
      `editor.main.nls.${locale}.js`
    );

    const localeTargetPath = path.join(
      TARGET_DIR,
      'editor',
      `editor.main.nls.${locale}.js`
    );

    if (fs.existsSync(localeSourcePath)) {
      copyFile(localeSourcePath, localeTargetPath);
    } else {
      console.warn(`⚠ Локализация не найдена: ${locale}`);
    }
  }

  // Копирование loader.js
  console.log('\n📄 Копирование loader...');
  const loaderSource = path.join(
    __dirname,
    'node_modules',
    'monaco-editor',
    'min',
    'vs',
    'loader.js'
  );
  const loaderTarget = path.join(TARGET_DIR, 'loader.js');

  if (fs.existsSync(loaderSource)) {
    copyFile(loaderSource, loaderTarget);
  }

  console.log('\n✅ Копирование завершено успешно!');
  console.log(`📁 Файлы скопированы в: ${TARGET_DIR}`);
}

// Запуск скрипта
try {
  copyMonacoLocales();
} catch (error) {
  console.error('❌ Критическая ошибка:', error);
  process.exit(1);
}