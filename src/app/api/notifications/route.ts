import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { createNotification } from '@/lib/notifications';

// GET - получить все уведомления пользователя
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.userId,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.userId,
        read: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка получения уведомлений' },
      { status: 500 }
    );
  }
}

// POST - отметить уведомление как прочитанное ИЛИ проверить дедлайны
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
    const { id, markAllAsRead, checkDeadlines } = body;

    // Проверка дедлайнов
    if (checkDeadlines) {
      // Получаем задачи пользователя
      const tasks = await prisma.task.findMany({
        where: {
          assignedToId: session.userId,
          status: {
            not: 'COMPLETED',
          },
          deadline: {
            not: null,
          },
        },
      });

      const now = new Date();
      
      for (const task of tasks) {
        if (!task.deadline) continue;

        const deadline = new Date(task.deadline);
        const hoursUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        // Проверяем, осталось ли 10 часов или меньше, но больше 0
        if (hoursUntilDeadline > 0 && hoursUntilDeadline <= 10) {
          const hoursLeft = Math.ceil(hoursUntilDeadline);
          
          // Проверяем, было ли уже уведомление с таким же количеством часов для этой задачи
          const existingNotification = await prisma.notification.findFirst({
            where: {
              userId: session.userId,
              taskId: task.id,
              type: 'GENERAL',
              message: {
                contains: `осталось ${hoursLeft} ч.`,
              },
              createdAt: {
                gte: new Date(now.getTime() - 60 * 60 * 1000), // за последний час
              },
            },
          });

          // Если уведомления с таким количеством часов ещё не было за последний час - создаём
          if (!existingNotification) {
            await createNotification({
              userId: session.userId,
              type: 'GENERAL',
              title: `⏰ Дедлайн задачи`,
              message: `До дедлайна задачи "${task.title}" осталось ${hoursLeft} ч.`,
              taskId: task.id,
            });
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Дедлайны проверены',
      });
    }

    // Отметить уведомление как прочитанное
    if (markAllAsRead) {
      await prisma.notification.updateMany({
        where: {
          userId: session.userId,
          read: false,
        },
        data: {
          read: true,
        },
      });
    } else if (id) {
      await prisma.notification.update({
        where: { id },
        data: {
          read: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Notifications POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка обработки запроса' },
      { status: 500 }
    );
  }
}
