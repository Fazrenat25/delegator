import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);
const BACKUP_DIR = '/var/backups/delegator';

// Получение окружения БД
function getDbEnv() {
  const url = process.env.DATABASE_URL || '';
  const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
  if (!match) throw new Error('Invalid DATABASE_URL');
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: match[4],
    database: match[5],
  };
}

// GET — список всех бэкапов
export async function GET() {
  try {
    const backups = await prisma.databaseBackup.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Проверяем наличие файлов
    const enrichedBackups = await Promise.all(
      backups.map(async (backup) => {
        const filePath = path.join(BACKUP_DIR, backup.filename);
        const fileExists = fs.existsSync(filePath);
        return { ...backup, fileExists };
      })
    );

    return NextResponse.json({ success: true, data: enrichedBackups });
  } catch (error) {
    console.error('Get backups error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка получения списка бэкапов' },
      { status: 500 }
    );
  }
}

// POST — создание бэкапа
export async function POST() {
  try {
    // Создаём директорию
    await execAsync(`mkdir -p ${BACKUP_DIR}`);

    const dbEnv = getDbEnv();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `delegator_backup_${timestamp}.sql`;
    const filePath = path.join(BACKUP_DIR, filename);

    // Выполняем pg_dump
    const dumpCommand = `PGPASSWORD=${dbEnv.password} pg_dump -h ${dbEnv.host} -p ${dbEnv.port} -U ${dbEnv.user} -d ${dbEnv.database} -F p -f ${filePath}`;
    await execAsync(dumpCommand);

    // Проверяем размер файла
    const stats = fs.statSync(filePath);
    const filesize = stats.size;

    // Сохраняем в БД
    const backup = await prisma.databaseBackup.create({
      data: {
        filename,
        filesize,
        status: 'COMPLETED',
      },
    });

    return NextResponse.json({ success: true, data: backup });
  } catch (error) {
    console.error('Create backup error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка создания бэкапа' },
      { status: 500 }
    );
  }
}

// DELETE — удаление бэкапа
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const backupId = searchParams.get('id');

    if (!backupId) {
      return NextResponse.json(
        { success: false, error: 'ID бэкапа не указан' },
        { status: 400 }
      );
    }

    const backup = await prisma.databaseBackup.findUnique({
      where: { id: backupId },
    });

    if (!backup) {
      return NextResponse.json(
        { success: false, error: 'Бэкап не найден' },
        { status: 404 }
      );
    }

    // Удаляем файл
    const filePath = path.join(BACKUP_DIR, backup.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Удаляем запись
    await prisma.databaseBackup.delete({
      where: { id: backupId },
    });

    return NextResponse.json({ success: true, message: 'Бэкап удалён' });
  } catch (error) {
    console.error('Delete backup error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка удаления бэкапа' },
      { status: 500 }
    );
  }
}
