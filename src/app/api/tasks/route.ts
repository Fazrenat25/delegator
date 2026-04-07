import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { createNotification } from '@/lib/notifications';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Проверяем, запрошена ли конкретная задача по ID
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');

    if (taskId) {
      // Получаем конкретную задачу
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
          createdBy: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          assignedTo: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          company: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!task) {
        return NextResponse.json(
          { success: false, error: 'Задача не найдена' },
          { status: 404 }
        );
      }

      // Проверяем права доступа
      if (user.role !== 'DIRECTOR' && task.assignedToId !== user.id) {
        return NextResponse.json(
          { success: false, error: 'Нет прав для просмотра задачи' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        data: task,
      });
    }

    // Проверяем, запрошена ли фильтрация по assignedTo (для директора)
    const assignedTo = searchParams.get('assignedTo');

    // Директор видит все задачи компании, сотрудник только свои
    const whereClause: { companyId?: string; assignedToId?: string } = {};

    if (assignedTo) {
      // Если запрошена фильтрация по конкретному сотруднику
      whereClause.assignedToId = assignedTo;
    } else if (user.role === 'DIRECTOR' && user.companyId) {
      whereClause.companyId = user.companyId;
    } else {
      whereClause.assignedToId = user.id;
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error('Tasks error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка получения задач' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user || user.role !== 'DIRECTOR') {
      return NextResponse.json(
        { success: false, error: 'Только директор может создавать задачи' },
        { status: 403 }
      );
    }

    const { title, description, priority, deadline, assignedToId } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Название и описание обязательны' },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        deadline: deadline ? new Date(deadline) : null,
        assignedToId: assignedToId || null,
        companyId: user.companyId!,
        createdById: user.id,
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        assignedTo: {
          select: {
            firstName: true,
            lastName: true,
            id: true,
          },
        },
      },
    });

    // Создаём уведомление для сотрудника, если задача назначена на него
    if (assignedToId && task.assignedTo) {
      await createNotification({
        userId: assignedToId,
        type: 'TASK_ASSIGNED',
        title: 'Новая задача',
        message: `Вам назначена задача "${task.title}"`,
        taskId: task.id,
      });
    }

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка создания задачи' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: 'ID задачи не указан' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, assignedToId } = body;

    // Получаем задачу
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Задача не найдена' },
        { status: 404 }
      );
    }

    // Проверяем права
    if (user.role !== 'DIRECTOR' && task.assignedToId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Нет прав для изменения задачи' },
        { status: 403 }
      );
    }

    // Обновляем задачу
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(status && { status }),
        ...(assignedToId !== undefined && { assignedToId }),
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Создаём уведомления
    if (status === 'IN_PROGRESS' && updatedTask.assignedToId) {
      // Уведомляем директора о том, что задача взята в работу
      await createNotification({
        userId: updatedTask.createdById,
        type: 'TASK_STATUS_CHANGED',
        title: 'Задача в работе',
        message: `${updatedTask.assignedTo?.firstName} ${updatedTask.assignedTo?.lastName} взял(а) задачу "${task.title}" в работу`,
        taskId: task.id,
      });
    }

    if (status === 'COMPLETED' && updatedTask.assignedToId) {
      // Уведомляем директора о выполнении задачи
      await createNotification({
        userId: updatedTask.createdById,
        type: 'TASK_COMPLETED',
        title: 'Задача выполнена',
        message: `${updatedTask.assignedTo?.firstName} ${updatedTask.assignedTo?.lastName} выполнил(а) задачу "${task.title}"`,
        taskId: task.id,
      });
    }

    if (assignedToId && assignedToId !== task.assignedToId) {
      // Уведомляем нового исполнителя о назначении
      await createNotification({
        userId: assignedToId,
        type: 'TASK_ASSIGNED',
        title: 'Новая задача',
        message: `Вам назначена задача "${task.title}"`,
        taskId: task.id,
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка обновления задачи' },
      { status: 500 }
    );
  }
}

// DELETE - удалить задачу
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: 'ID задачи обязателен' },
        { status: 400 }
      );
    }

    // Проверяем существование задачи
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Задача не найдена' },
        { status: 404 }
      );
    }

    // Только директор или создатель задачи может удалить её
    if (user.role !== 'DIRECTOR' && task.createdById !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Нет прав на удаление задачи' },
        { status: 403 }
      );
    }

    // Удаляем задачу
    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json({
      success: true,
      message: 'Задача успешно удалена',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка удаления задачи' },
      { status: 500 }
    );
  }
}

// PATCH - обновить задачу
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: 'ID задачи обязателен' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, status, priority, deadline, assignedToId } = body;

    // Проверяем существование задачи
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignedTo: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Задача не найдена' },
        { status: 404 }
      );
    }

    // Проверяем права доступа
    if (user.role !== 'DIRECTOR' && task.assignedToId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Нет прав на редактирование задачи' },
        { status: 403 }
      );
    }

    // Обновляем задачу (только если значения переданы и не пустые)
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
        ...(assignedToId !== undefined && { assignedToId: assignedToId || null }),
      },
      include: {
        assignedTo: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Уведомления
    if (status === 'IN_PROGRESS' && updatedTask.assignedToId) {
      await createNotification({
        userId: updatedTask.createdById,
        type: 'TASK_STATUS_CHANGED',
        title: 'Задача в работе',
        message: `${updatedTask.assignedTo?.firstName} ${updatedTask.assignedTo?.lastName} взял(а) задачу "${task.title}" в работу`,
        taskId: task.id,
      });
    }

    if (assignedToId && assignedToId !== task.assignedToId) {
      await createNotification({
        userId: assignedToId,
        type: 'TASK_ASSIGNED',
        title: 'Новая задача',
        message: `Вам назначена задача "${task.title}"`,
        taskId: task.id,
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    console.error('Patch task error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка обновления задачи' },
      { status: 500 }
    );
  }
}
