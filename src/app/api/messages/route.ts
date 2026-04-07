import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET - получить сообщения комнаты или личные
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const userId = searchParams.get('userId');

    let messages;

    if (roomId) {
      // Сообщения общей комнаты
      messages = await prisma.message.findMany({
        where: { roomId },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
        take: 100,
      });
    } else if (userId) {
      // Личные сообщения
      messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: session.userId, receiverId: userId },
            { senderId: userId, receiverId: session.userId },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          receiver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
        take: 100,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Не указан roomId или userId' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка получения сообщений' },
      { status: 500 }
    );
  }
}

// POST - отправить сообщение
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
    const { content, roomId, receiverId } = body;

    if (!content || (!roomId && !receiverId)) {
      return NextResponse.json(
        { success: false, error: 'Сообщение и получатель обязательны' },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: session.userId,
        roomId: roomId || null,
        receiverId: receiverId || null,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка отправки сообщения' },
      { status: 500 }
    );
  }
}
