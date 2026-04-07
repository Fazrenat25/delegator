import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET - получить список сотрудников для личных сообщений
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user || !user.companyId) {
      return NextResponse.json(
        { success: false, error: 'Компания не найдена' },
        { status: 404 }
      );
    }

    // Получаем всех пользователей компании кроме текущего
    const employees = await prisma.user.findMany({
      where: {
        companyId: user.companyId,
        id: {
          not: session.userId,
        },
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        position: true,
        role: true,
      },
      orderBy: { firstName: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error('Get employees error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка получения сотрудников' },
      { status: 500 }
    );
  }
}
