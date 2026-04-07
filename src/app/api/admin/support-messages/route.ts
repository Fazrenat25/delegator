import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/admin';

// GET - получение всех сообщений поддержки
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Не авторизован' }, { status: 401 });
    }

    const admin = await getCurrentAdmin(token);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Доступ запрещён' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';
    const userId = searchParams.get('userId') || '';

    const where: any = {};

    if (status) {
      where.status = status;
    }
    if (userId) {
      where.userId = userId;
    }

    console.log('Loading support messages with where:', where);
    
    const messages = await prisma.supportMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        replies: {
          orderBy: { createdAt: 'asc' },
        },
      },
      take: 100,
    });

    console.log('Loaded messages:', messages.length);

    return NextResponse.json({
      success: true,
      data: { messages },
    });
  } catch (error) {
    console.error('Admin support messages GET error:', error);
    return NextResponse.json({ success: false, error: 'Ошибка получения сообщений' }, { status: 500 });
  }
}

// PUT - ответ на сообщение поддержки
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Не авторизован' }, { status: 401 });
    }

    const admin = await getCurrentAdmin(token);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Доступ запрещён' }, { status: 403 });
    }

    const body = await request.json();
    const { messageId, reply, status } = body;

    if (!messageId) {
      return NextResponse.json({ success: false, error: 'ID сообщения обязателен' }, { status: 400 });
    }

    const updateData: any = {};
    
    // Если есть ответ - создаём запись ответа
    if (reply !== undefined && reply !== null) {
      await prisma.supportMessageReply.create({
        data: {
          messageId,
          fromAdmin: true,
          message: reply,
        },
      });
    }
    
    if (status !== undefined) {
      updateData.status = status;
    }
    
    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = new Date();
    }

    const message = await prisma.supportMessage.update({
      where: { id: messageId },
      data: updateData,
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: { message },
    });
  } catch (error) {
    console.error('Admin support messages PUT error:', error);
    return NextResponse.json({ success: false, error: 'Ошибка обновления сообщения' }, { status: 500 });
  }
}

// DELETE - удаление сообщения
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Не авторизован' }, { status: 401 });
    }

    const admin = await getCurrentAdmin(token);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Доступ запрещён' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const messageId = searchParams.get('messageId');

    if (!messageId) {
      return NextResponse.json({ success: false, error: 'ID сообщения обязателен' }, { status: 400 });
    }

    await prisma.supportMessage.delete({
      where: { id: messageId },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Admin support messages DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Ошибка удаления сообщения' }, { status: 500 });
  }
}
