import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - получение сообщений пользователя с ответами
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Не авторизован' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Неверный токен' }, { status: 401 });
    }

    const messages = await prisma.supportMessage.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: { messages },
    });
  } catch (error) {
    console.error('Support messages GET error:', error);
    return NextResponse.json({ success: false, error: 'Ошибка получения сообщений' }, { status: 500 });
  }
}

// POST - создание нового сообщения или ответ на существующее
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    console.log('Token:', token ? 'exists' : 'missing');
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'Не авторизован' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    console.log('Payload:', payload);
    
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Неверный токен' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Request body:', body);
    
    const { message, replyToId } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Сообщение не может быть пустым' }, { status: 400 });
    }

    // Если это ответ на существующее обращение
    if (replyToId) {
      console.log('Creating reply to message', replyToId);
      
      // Создаём ответ
      const reply = await prisma.supportMessageReply.create({
        data: {
          messageId: replyToId,
          fromAdmin: false,
          message: message.trim(),
        },
      });

      // Обновляем статус обращения
      await prisma.supportMessage.update({
        where: { id: replyToId },
        data: {
          status: 'OPEN',
          updatedAt: new Date(),
        },
      });

      console.log('Created reply:', reply);

      return NextResponse.json({
        success: true,
        data: { message: reply },
      });
    }

    // Создаём новое обращение
    console.log('Creating new message for user', payload.userId);
    const supportMessage = await prisma.supportMessage.create({
      data: {
        userId: payload.userId,
        message: message.trim(),
      },
    });
    console.log('Created message:', supportMessage);

    return NextResponse.json({
      success: true,
      data: { message: supportMessage },
    });
  } catch (error) {
    console.error('Support messages POST error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json({ success: false, error: `Ошибка отправки сообщения: ${errorMessage}` }, { status: 500 });
  }
}
