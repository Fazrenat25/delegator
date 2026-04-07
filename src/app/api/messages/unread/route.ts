import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET - получить количество непрочитанных сообщений от каждого пользователя
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      );
    }

    // Получаем количество непрочитанных сообщений от каждого пользователя
    const unreadCounts = await prisma.message.groupBy({
      by: ['senderId'],
      where: {
        receiverId: session.userId,
        read: false,
      },
      _count: {
        id: true,
      },
    });

    // Преобразуем в объект { userId: count }
    const unreadMap: Record<string, number> = {};
    unreadCounts.forEach(({ senderId, _count }) => {
      unreadMap[senderId] = _count.id;
    });

    return NextResponse.json({
      success: true,
      data: unreadMap,
    });
  } catch (error) {
    console.error('Get unread messages error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка получения непрочитанных сообщений' },
      { status: 500 }
    );
  }
}
