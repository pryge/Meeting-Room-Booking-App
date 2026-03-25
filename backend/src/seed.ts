import sequelize from "./config/database";
import bcrypt from "bcryptjs";
import { User } from "./models";

const seedAdmin = async () => {
  try {
    sequelize.sync();

    const adminExist = await User.findOne({where: {email: 'admin@example.com'}});

    if (adminExist) {
      console.log('Admin already exist');
      return;
    }

    const hashedPassword = await bcrypt.hash('adminpasswrd123', 10);

    await User.create({
      name: 'Demo Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Demo admin created: admin@example.com / adminpasswd123');
  } catch (error) {
    console.log('Error seeding admin.',error);
  } finally {
    process.exit();
  }
}

seedAdmin();