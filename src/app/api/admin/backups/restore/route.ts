import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);
const BACKUP_DIR = '/var/backups/delegator';

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

// POST — восстановление из бэкапа
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { backupId } = body;

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

    const filePath = path.join(BACKUP_DIR, backup.filename);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: 'Файл бэкапа не найден' },
        { status: 404 }
      );
    }

    // Обновляем статус
    await prisma.databaseBackup.update({
      where: { id: backupId },
      data: { status: 'RESTORING' },
    });

    const dbEnv = getDbEnv();

    // Восстанавливаем базу
    const restoreCommand = `PGPASSWORD=${dbEnv.password} psql -h ${dbEnv.host} -p ${dbEnv.port} -U ${dbEnv.user} -d ${dbEnv.database} -f ${filePath}`;
    await execAsync(restoreCommand);

    // Обновляем статус
    await prisma.databaseBackup.update({
      where: { id: backupId },
      data: { status: 'COMPLETED' },
    });

    return NextResponse.json({
      success: true,
      message: 'База данных восстановлена',
    });
  } catch (error) {
    console.error('Restore backup error:', error);

    // Обновляем статус на failed
    try {
      const body = await request.json();
      if (body?.backupId) {
        await prisma.databaseBackup.update({
          where: { id: body.backupId },
          data: { status: 'FAILED' },
        });
      }
    } catch (e) {
      // ignore
    }

    const errorMessage = error instanceof Error ? error.message : 'Ошибка восстановления';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
