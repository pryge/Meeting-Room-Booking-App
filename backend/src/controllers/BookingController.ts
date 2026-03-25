import { Request, Response } from 'express';
import { Booking } from '../models';
import { Op } from 'sequelize';

export const getMyBookings = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: ['room'],
      order: [['startTime', 'DESC']]
    });
    res.status(200).json({ message: 'My bookings fetched successfully', bookings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching your bookings' });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  const { roomId } = req.query;

  try {
    const bookings = await Booking.findAll({where: {roomId: roomId}})
    res.status(200).json({message: 'Bookings fetched successfully', bookings})
  } catch (error) {
    console.log(error)
    res.status(500).json({message: 'Error fetching bookings'})
  }
};

export const createBooking = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({message: 'Unauthorized'});
  }

  const { roomId, startTime, endTime, description } = req.body;
  const userId = req.user.id;

  try {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start < new Date()) {
      return res.status(400).json({message: 'Cannot book in the past'})
    }

    if (start >= end) {
      return res.status(400).json({message: 'Start time must be before end time'})
    }

    const overlappingBooking = await Booking.findOne({
      where: {
        roomId,
        [Op.or]: [
          {
            startTime: {
              [Op.lt]: end
            },
            endTime: {
              [Op.gt]: start
            }
          }
        ]
      }
    });

    if (overlappingBooking) {
      return res.status(400).json({message: 'Room is already booked for this time slot'})
    }

    const booking = await Booking.create({
      roomId,
      userId,
      startTime,
      endTime,
      description
    })
    res.status(201).json({message: 'Booking created successfully', booking})
  } catch (error) {
    console.log(error)
    res.status(500).json({message: 'Error creating booking'})
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({message: 'Booking not found'})
    }

    if (!req.user || (req.user.role !== 'admin' && booking.userId !== req.user.id)) {
      return res.status(403).json({message: 'Forbidden. You do not have permission to cancel this booking'})
    }
    
    await booking.destroy();
    res.status(200).json({message: 'Booking cancelled successfully'})
  } catch (error) {
    console.log(error)
    res.status(500).json({message: 'Error cancelling booking'})
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({message: 'Booking not found'})
    }

    if (!req.user || (req.user.role !== 'admin' && booking.userId !== req.user.id)) {
      return res.status(403).json({message: 'Forbidden. You do not have permission to update this booking'})
    }

    const { startTime, endTime, description } = req.body;
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start < new Date()) {
      return res.status(400).json({message: 'Cannot update booking to a past time'})
    }

    if (start >= end) {
      return res.status(400).json({message: 'Start time must be before end time'})
    }

    const overlappingBooking = await Booking.findOne({
      where: {
        roomId: booking.roomId,
        id: { [Op.ne]: id },
        [Op.or]: [
          {
            startTime: {
              [Op.lt]: end
            },
            endTime: {
              [Op.gt]: start
            }
          }
        ]
      }
    });

    if (overlappingBooking) {
      return res.status(400).json({message: 'Room is already booked for this time slot'})
    }

    booking.startTime = startTime;
    booking.endTime = endTime;
    booking.description = description;
    await booking.save();
    res.status(200).json({message: 'Booking updated successfully', booking})
  } catch (error) {
    console.log(error)
    res.status(500).json({message: 'Error updating booking'})
  }
}
