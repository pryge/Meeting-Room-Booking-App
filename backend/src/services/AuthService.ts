import { User } from '../models';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

export class AuthService {
  static async register(data: any) {
    const { email, password, name } = data;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: 'user'
    });

    return user;
  }

  static async login(data: any) {
    const { email, password } = data;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    return { token, user };
  }

  static async getMe(id: number) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }
}
