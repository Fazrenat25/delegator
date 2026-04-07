import { prisma } from '@/lib/prisma';

export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return user?.role === 'ADMIN';
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
}

export async function getCurrentAdmin(token: string) {
  try {
    const { verifyToken } = await import('@/lib/auth');
    const payload = await verifyToken(token);

    if (!payload) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        email: true,
      },
    });

    if (!user || user.role !== 'ADMIN') {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting current admin:', error);
    return null;
  }
}
