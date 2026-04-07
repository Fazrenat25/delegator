import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// POST - отметить сообщения пользователя как прочитанные
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { senderId } = body;

    if (!senderId) {
      return NextResponse.json(
        { success: false, error: 'senderId обязателен' },
        { status: 400 }
      );
    }

    // Отмечаем все сообщения от этого пользователя как прочитанные
    await prisma.message.updateMany({
      where: {
        receiverId: session.userId,
        senderId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка отметки сообщений' },
      { status: 500 }
    );
  }
}
