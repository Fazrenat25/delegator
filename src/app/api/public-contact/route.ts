import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - создание публичного обращения от неавторизованных пользователей
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Сообщение не может быть пустым' },
        { status: 400 }
      );
    }

    // Создаём обращение без привязки к пользователю (для неавторизованных)
    const supportMessage = await prisma.supportMessage.create({
      data: {
        userId: undefined,
        message: message.trim(),
        status: 'OPEN',
      },
    });

    return NextResponse.json({
      success: true,
      data: { message: supportMessage },
    });
  } catch (error) {
    console.error('Public contact POST error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json(
      { success: false, error: `Ошибка отправки сообщения: ${errorMessage}` },
      { status: 500 }
    );
  }
}
