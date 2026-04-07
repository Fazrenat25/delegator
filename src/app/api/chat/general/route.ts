import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET - получить общую комнату или создать её
export async function GET(request: NextRequest) {
  try {
    console.log('=== Get General Room ===');
    const session = await getSession(request);
    console.log('Session:', session);

    if (!session) {
      console.log('No session');
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      );
    }

    // Ищем общую комнату
    console.log('Finding general room...');
    let generalRoom = await prisma.room.findFirst({
      where: { type: 'GENERAL' },
    });
    console.log('Found room:', generalRoom);

    // Если нет общей комнаты - создаём
    if (!generalRoom) {
      console.log('Creating general room...');
      generalRoom = await prisma.room.create({
        data: {
          type: 'GENERAL',
          name: 'Общий чат',
        },
      });
      console.log('Created room:', generalRoom);
    }

    // Проверяем, является ли пользователь участником
    console.log('Checking membership for user:', session.userId, 'in room:', generalRoom.id);
    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId: generalRoom.id,
          userId: session.userId,
        },
      },
    });
    console.log('Membership:', membership);

    // Если не участник - добавляем
    if (!membership) {
      console.log('Adding user to room...');
      await prisma.roomMember.create({
        data: {
          roomId: generalRoom.id,
          userId: session.userId,
        },
      });
      console.log('User added to room');
    }

    return NextResponse.json({
      success: true,
      data: generalRoom,
    });
  } catch (error) {
    console.error('Get general room error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return NextResponse.json(
      { success: false, error: 'Ошибка получения комнаты: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
