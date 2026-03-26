import { Booking } from '../models';
import { Op } from 'sequelize';
import { AppError } from '../utils/AppError';

export class BookingService {
  /**
   * Fetch all bookings for a user
   */
  static async getMyBookings(userId: number) {
    return await Booking.findAll({
      where: { userId },
      include: ['Room'],
      order: [['startTime', 'DESC']]
    });
  }

  /**
   * Fetch all bookings for a specific room
   */
  static async getBookingsByRoomId(roomId: number) {
    return await Booking.findAll({ where: { roomId } });
  }

  /**
   * Create a new booking with validation
   */
  static async createBooking(data: {
    roomId: number;
    userId: number;
    startTime: string | Date;
    endTime: string | Date;
    description?: string;
  }) {
    const { roomId, userId, startTime, endTime, description } = data;
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start < new Date()) {
      throw new AppError('Cannot book in the past', 400);
    }

    if (start >= end) {
      throw new AppError('Start time must be before end time', 400);
    }

    const overlap = await this.checkOverlap(roomId, start, end);
    if (overlap) {
      throw new AppError('Room is already booked for this time slot', 400);
    }

    return await Booking.create({
      roomId,
      userId,
      startTime: start,
      endTime: end,
      description
    });
  }

  /**
   * Cancel a booking with permission check
   */
  static async cancelBooking(bookingId: number, userId: number, role: string) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (role !== 'admin' && booking.userId !== userId) {
      throw new AppError('Forbidden. You do not have permission to cancel this booking', 403);
    }

    await booking.destroy();
    return true;
  }

  /**
   * Update a booking with validation and permission check
   */
  static async updateBooking(
    bookingId: number,
    userId: number,
    role: string,
    data: { startTime: string | Date; endTime: string | Date; description?: string }
  ) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (role !== 'admin' && booking.userId !== userId) {
      throw new AppError('Forbidden. You do not have permission to update this booking', 403);
    }

    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (start < new Date()) {
      throw new AppError('Cannot update booking to a past time', 400);
    }

    if (start >= end) {
      throw new AppError('Start time must be before end time', 400);
    }

    const overlap = await this.checkOverlap(booking.roomId, start, end, bookingId);
    if (overlap) {
      throw new AppError('Room is already booked for this time slot', 400);
    }

    booking.startTime = start;
    booking.endTime = end;
    if (data.description !== undefined) {
      booking.description = data.description;
    }
    
    await booking.save();
    return booking;
  }

  /**
   * Check for overlapping bookings
   */
  private static async checkOverlap(roomId: number, start: Date, end: Date, excludeId?: number) {
    const where: any = {
      roomId,
      [Op.or]: [
        {
          startTime: { [Op.lt]: end },
          endTime: { [Op.gt]: start }
        }
      ]
    };

    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    return await Booking.findOne({ where });
  }
}
