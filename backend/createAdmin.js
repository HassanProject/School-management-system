const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('./utils/auth');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { email: 'admin@school.com' }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@school.com',
        password: await hashPassword('admin123'),
        role: 'ADMIN',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+23276123456'
      }
    });

    console.log('✅ Admin user created successfully');
    console.log('Email: admin@school.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 