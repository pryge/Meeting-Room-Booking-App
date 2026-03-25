import { Request, Response } from "express";
import { Room } from "../models";
import { createRoomSchema, updateRoomSchema } from "../validations/room";

export const getRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.findAll();
    res.status(200).json({ rooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching rooms" });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const validation = createRoomSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.issues.map(err => ({ field: err.path[0], message: err.message }))
      });
    }

    const { name, capacity } = validation.data;

    const room = await Room.create({ name, capacity });

    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    console.error("Error in createRoom:", error);
    res.status(500).json({ message: "Error creating room" });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const room = await Room.findByPk(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    await room.destroy();

    res.status(200).json({ message: "Room deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting room" });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const validation = updateRoomSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.issues.map(err => ({ field: err.path[0], message: err.message }))
      });
    }

    const room = await Room.findByPk(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const { name, capacity } = validation.data;

    if (name) room.name = name;
    if (capacity) room.capacity = capacity;

    await room.save();

    res.status(200).json({ message: "Room updated successfully", room });
  } catch (error) {
    console.error("Error in updateRoom:", error);
    res.status(500).json({ message: "Error updating room" });
  }
};