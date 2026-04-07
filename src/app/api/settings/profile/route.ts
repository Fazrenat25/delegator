import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { verifyPassword, hashPassword } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email } = body;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'Имя и фамилия обязательны' },
        { status: 400 }
      );
    }

    // Проверка email на уникальность (если он изменился и не пустой)
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: {
            not: session.userId,
          },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Email уже используется' },
          { status: 400 }
        );
      }
    }

    // Обновление профиля
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        firstName,
        lastName,
        email: email || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Профиль успешно обновлён',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка обновления профиля' },
      { status: 500 }
    );
  }
}
