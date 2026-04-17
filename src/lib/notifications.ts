import { prisma } from '@/lib/prisma';

export interface CreateNotificationParams {
  userId: string;
  type: 'TASK_ASSIGNED' | 'TASK_STATUS_CHANGED' | 'TASK_COMPLETED' | 'TASK_COMMENT' | 'GENERAL';
  title: string;
  message: string;
  taskId?: string;
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  taskId,
}: CreateNotificationParams) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      taskId,
    },
  });
}

export async function createNotificationsForDirectors({
  companyId,
  type,
  title,
  message,
  taskId,
}: Omit<CreateNotificationParams, 'userId'> & { companyId: string }) {
  // Находим всех директоров компании
  const directors = await prisma.user.findMany({
    where: {
      companyId,
      role: 'DIRECTOR',
    },
    select: {
      id: true,
    },
  });

  // Создаём уведомление для каждого директора
  const notifications = await Promise.all(
    directors.map((director: any) =>
      createNotification({
        userId: director.id,
        type,
        title,
        message,
        taskId,
      })
    )
  );

  return notifications;
}
