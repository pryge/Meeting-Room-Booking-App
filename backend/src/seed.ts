import sequelize from "./config/database";
import bcrypt from "bcryptjs";
import { User, Room } from "./models";

const seedDatabase = async () => {
  try {
    await sequelize.sync();

    // Для адміна
    const adminExist = await User.findOne({where: {email: 'admin@example.com'}});
    if (!adminExist) {
        const hashedPassword = await bcrypt.hash('adminpasswd123', 10);
        await User.create({
          name: 'Demo Admin',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'admin'
        });
        console.log('Demo admin created: admin@example.com / adminpasswd123');
    } else {
        console.log('Admin already exists');
    }

    // Для кімнати
    const roomsCount = await Room.count();
    if (roomsCount === 0) {
        await Room.bulkCreate([
            { name: 'Conference Room A', capacity: 10 },
            { name: 'Meeting Room B', capacity: 4 },
            { name: 'Training Room C', capacity: 20 },
        ]);
        console.log('Demo rooms created');
    } else {
        console.log('Rooms already exist');
    }

  } catch (error) {
    console.log('Error seeding database.', error);
  } finally {
    process.exit();
  }
}

seedDatabase();