import { prisma } from '../src/lib/prisma';

async function createAdmin() {
  try {
    // Проверяем, есть ли уже админы
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      console.log('✅ Администратор уже существует:', existingAdmin.username);
      return;
    }

    // Хэшируем пароль
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Создаём администратора
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        firstName: 'System',
        lastName: 'Administrator',
        role: 'ADMIN',
        position: 'MANAGER',
      },
    });

    console.log('✅ Администратор успешно создан!');
    console.log('   Username:', admin.username);
    console.log('   Password: admin123');
    console.log('   ID:', admin.id);
    console.log('\n⚠️  Измените пароль после первого входа!');
  } catch (error) {
    console.error('❌ Ошибка создания администратора:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
