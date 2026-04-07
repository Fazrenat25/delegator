import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/admin';

// GET - получение всех подписок
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

    const subscriptions = await prisma.subscription.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: { subscriptions },
    });
  } catch (error) {
    console.error('Admin subscriptions error:', error);
    return NextResponse.json({ success: false, error: 'Ошибка получения подписок' }, { status: 500 });
  }
}

// PUT - обновление подписки (смена тарифа)
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
    const { userId, plan, endDate, isActive } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'ID пользователя обязателен' }, { status: 400 });
    }

    // Находим подписку пользователя или создаём новую
    let subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    const updateData: any = {};
    if (plan !== undefined) updateData.plan = plan;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (subscription) {
      subscription = await prisma.subscription.update({
        where: { userId },
        data: updateData,
      });
    } else {
      subscription = await prisma.subscription.create({
        data: {
          userId,
          ...updateData,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: { subscription },
    });
  } catch (error) {
    console.error('Admin update subscription error:', error);
    return NextResponse.json({ success: false, error: 'Ошибка обновления подписки' }, { status: 500 });
  }
}
