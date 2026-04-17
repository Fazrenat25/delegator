import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/admin';

// GET - получение статистики админ-панели
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

    // Получаем статистику
    const [totalUsers, totalCompanies, totalTasks, activeSubscriptions] = await Promise.all([
      prisma.user.count(),
      prisma.company.count(),
      prisma.task.count(),
      prisma.subscription.count({ where: { isActive: true } }),
    ]);

    // Пользователи по ролям
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
    });

    // Подписки по тарифам
    const subscriptionsByPlan = await prisma.subscription.groupBy({
      by: ['plan'],
      _count: true,
    });

    // Последние пользователи
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        company: { select: { name: true } },
      },
    });

    // Активные подписки с истекающим сроком (ближайшие 3 дня)
    const expiringSubscriptions = await prisma.subscription.findMany({
      where: {
        isActive: true,
        endDate: {
          lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          gte: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalCompanies,
          totalTasks,
          activeSubscriptions,
          usersByRole: Object.fromEntries(usersByRole.map((r: any) => [r.role, r._count])),
          subscriptionsByPlan: Object.fromEntries(subscriptionsByPlan.map((s: any) => [s.plan, s._count])),
        },
        recentUsers,
        expiringSubscriptions,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ success: false, error: 'Ошибка получения статистики' }, { status: 500 });
  }
}
