import { Request, Response } from "express";
import { User } from "../models";
import bcrypt from "bcryptjs";
import { loginSchema, registerSchema } from "../validations/auth";
import * as jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validation.error.issues.map(err => ({ field: err.path[0], message: err.message }))
      });
    }

    const { email, password, name } = validation.data;

    const existingUser = await User.findOne({where: {email: email}})

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: 'user'
    });

    res.status(201).json({ message: 'User registered successfully' , user});
  } catch (error) {
    console.log('Error in register',error) 
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if(!validation.success) {
      return res.status(400).json({
        message: 'Login failed',
        errors: validation.error.issues.map(err => ({field: err.path[0], message: err.message}))
      })
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({where: {email: email}})
    if (!existingUser) {
      return res.status(400).json({message: 'User not found'})
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password)
    if(!isPasswordValid) {
      return res.status(400).json({message: 'Invalid password'})
    }

    const token = jwt.sign({id: existingUser.id, role: existingUser.role}, process.env.JWT_SECRET as string, {expiresIn: '1h'})
    
    res.status(200).json({message: 'Login successful', token, user: existingUser})
  } catch (error) {
    console.log('Error in login',error) 
    res.status(500).json({ message: 'Error logging in' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('token');
    res.status(200).json({message: 'Logout successful'})
  } catch (error) {
    console.log('Error in logout',error) 
    res.status(500).json({ message: 'Error logging out' });
  }
};
