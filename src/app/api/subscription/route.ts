import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Неверный токен' },
        { status: 401 }
      );
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: payload.userId },
    });

    if (!subscription) {
      return NextResponse.json({
        success: true,
        data: {
          plan: 'FREE',
          isActive: false,
          endDate: null,
        },
      });
    }

    // Проверяем, не истек ли срок подписки
    const now = new Date();
    let isActive = subscription.isActive;

    if (subscription.endDate && new Date(subscription.endDate) < now) {
      isActive = false;
      // Обновляем подписку до FREE после истечения срока
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          plan: 'FREE',
          isActive: false,
          endDate: null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        plan: isActive ? subscription.plan : 'FREE',
        isActive,
        endDate: subscription.endDate,
      },
    });
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка получения подписки' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Неверный токен' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan, period } = body;

    if (!plan || !['TEAM', 'BUSINESS'].includes(plan)) {
      return NextResponse.json(
        { success: false, error: 'Неверный тариф' },
        { status: 400 }
      );
    }

    // Вычисляем дату окончания подписки
    const now = new Date();
    const endDate = new Date(now);

    if (period === 'YEARLY') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // Проверяем существует ли подписка
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId: payload.userId },
    });

    if (existingSubscription) {
      // Обновляем существующую подписку
      await prisma.subscription.update({
        where: { userId: payload.userId },
        data: {
          plan,
          isActive: true,
          startDate: now,
          endDate,
        },
      });
    } else {
      // Создаем новую подписку
      await prisma.subscription.create({
        data: {
          userId: payload.userId,
          plan,
          isActive: true,
          startDate: now,
          endDate,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        plan,
        isActive: true,
        endDate,
      },
    });
  } catch (error) {
    console.error('Subscription update error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка обновления подписки' },
      { status: 500 }
    );
  }
}
