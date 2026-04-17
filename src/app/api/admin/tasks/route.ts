import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/admin';

// GET - получение всех задач с фильтрами
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
    const priority = searchParams.get('priority') || '';
    const companyId = searchParams.get('companyId') || '';

    const where: any = {};

    if (status) {
      where.status = status;
    }
    if (priority) {
      where.priority = priority;
    }
    if (companyId) {
      where.companyId = companyId;
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            users: {
              select: {
                id: true,
                role: true,
                subscription: {
                  select: {
                    plan: true,
                    isActive: true,
                    endDate: true,
                  },
                },
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Добавляем информацию о тарифе для каждой компании
    const tasksWithPlan = tasks.map((task: any) => {
      // Находим директора компании
      const director = task.company.users.find((u: any) => u.role === 'DIRECTOR');
      const subscription = director?.subscription;

      return {
        ...task,
        company: {
          ...task.company,
          plan: subscription?.plan || 'FREE',
          planActive: subscription?.isActive ?? true,
          planEndDate: subscription?.endDate,
        },
      };
    });

    // Логируем для отладки
    console.log('Tasks loaded:', tasksWithPlan.length);
    if (tasksWithPlan.length > 0) {
      console.log('First task company:', {
        name: tasksWithPlan[0].company.name,
        plan: tasksWithPlan[0].company.plan,
        planActive: tasksWithPlan[0].company.planActive,
      });
    }

    return NextResponse.json({
      success: true,
      data: { tasks: tasksWithPlan },
    });
  } catch (error) {
    console.error('Admin tasks error:', error);
    return NextResponse.json({ success: false, error: 'Ошибка получения задач' }, { status: 500 });
  }
}

// DELETE - удаление задачи
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
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ success: false, error: 'ID задачи обязателен' }, { status: 400 });
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin delete task error:', error);
    return NextResponse.json({ success: false, error: 'Ошибка удаления задачи' }, { status: 500 });
  }
}
