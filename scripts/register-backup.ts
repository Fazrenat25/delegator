import { prisma } from '../src/lib/prisma';

async function registerBackup(filename: string, filesize: number) {
  try {
    const backup = await prisma.databaseBackup.create({
      data: {
        filename,
        filesize,
        status: 'COMPLETED',
      },
    });
    console.log(`Запись в БД добавлена: ${backup.id}`);
  } catch (e) {
    console.error('Ошибка записи в БД:', e);
  } finally {
    await prisma.$disconnect();
  }
}

const filename = process.argv[2];
const filesize = parseInt(process.argv[3]);

if (!filename || !filesize) {
  console.error('Использование: tsx register-backup.ts <filename> <filesize>');
  process.exit(1);
}

registerBackup(filename, filesize);
