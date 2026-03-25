import sequelize from "./config/database";
import bcrypt from "bcryptjs";
import { User, Room } from "./models";

const seedDatabase = async () => {
  try {
    await sequelize.sync();

    // Для адміна
    const adminEmail = 'admin@example.com';
    const adminPassword = 'adminpasswd123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const adminExist = await User.findOne({where: {email: adminEmail}});
    if (!adminExist) {
        await User.create({
          name: 'Demo Admin',
          email: adminEmail,
          password: hashedPassword,
          role: 'admin'
        });
        console.log(`Demo admin created: ${adminEmail} / ${adminPassword}`);
    } else {
        adminExist.password = hashedPassword;
        adminExist.role = 'admin';
        await adminExist.save();
        console.log(`Admin password reset to: ${adminPassword}`);
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