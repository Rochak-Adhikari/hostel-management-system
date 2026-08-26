import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import Room from "../models/Room";
import Allocation from "../models/Allocation";
import Fee from "../models/Fee";
import Complaint from "../models/Complaint";
import Visitor from "../models/Visitor";
import Notice from "../models/Notice";
import { Role } from "../types/enum";

// Admin reports report summary aggregate metrics calculate garna ko lagi
export const getReportSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Students count
    const totalStudents = await User.countDocuments({ role: Role.STUDENT });
    const activeStudents = await User.countDocuments({ role: Role.STUDENT, isActive: true });

    // 2. Rooms count & breakdown
    const rooms = await Room.find({});
    const totalRooms = rooms.length;
    const occupiedRoomsCount = rooms.filter((r: any) => r.Occupied > 0).length;
    const availableRoomsCount = totalRooms - occupiedRoomsCount;

    // Room occupancy by type (Single, Double, Triple)
    const roomTypeMap: Record<string, { total: number; occupied: number }> = {};
    rooms.forEach((r: any) => {
      const type = r.RoomType || "Other";
      if (!roomTypeMap[type]) {
        roomTypeMap[type] = { total: 0, occupied: 0 };
      }
      roomTypeMap[type].total += r.Capacity || 1;
      roomTypeMap[type].occupied += r.Occupied || 0;
    });

    const roomOccupancyBreakdown = Object.entries(roomTypeMap).map(([label, counts]) => ({
      label,
      total: counts.total,
      occupied: counts.occupied,
    }));

    // Overall occupancy percentage
    const totalCapacity = rooms.reduce((sum: number, r: any) => sum + (r.Capacity || 0), 0);
    const totalOccupiedBeds = rooms.reduce((sum: number, r: any) => sum + (r.Occupied || 0), 0);
    const overallOccupancyPercent = totalCapacity > 0 ? Number(((totalOccupiedBeds / totalCapacity) * 100).toFixed(1)) : 0;

    // 3. Fee metrics & monthly collection
    const fees = await Fee.find({});
    const totalRevenue = fees
      .filter((f: any) => f.status === "Paid")
      .reduce((sum: number, f: any) => sum + (f.amount || 0), 0);

    // Monthly collection group
    const monthlyMap: Record<string, number> = {};
    fees.forEach((f: any) => {
      if (f.status === "Paid") {
        const monthKey = f.month || "Unknown";
        monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + (f.amount || 0);
      }
    });

    const paymentHistory = Object.entries(monthlyMap).map(([month, collected]) => ({
      month,
      collected,
    }));

    // Student fee status list (join student name & room)
    const studentsList = await User.find({ role: Role.STUDENT });
    const allocations = await Allocation.find({});
    const allocationsMap = new Map();
    allocations.forEach((a: any) => allocationsMap.set(String(a.student), String(a.room)));

    const roomsMap = new Map();
    rooms.forEach((r: any) => roomsMap.set(String(r._id), r.RoomNumber));

    const studentFeeStatusList = await Promise.all(
      studentsList.slice(0, 10).map(async (st: any) => {
        const latestFee = await Fee.findOne({ student: st._id }).sort({ createdAt: -1 });
        const roomId = allocationsMap.get(String(st._id));
        const roomNum = roomId ? roomsMap.get(roomId) || "Unassigned" : "Unassigned";

        return {
          id: st._id,
          name: st.full_name,
          room: roomNum,
          fee: latestFee ? latestFee.status : "No record",
        };
      })
    );

    // 4. Complaints metrics
    const totalComplaints = await Complaint.countDocuments({});
    const pendingComplaints = await Complaint.countDocuments({ status: "Pending" });
    const inProgressComplaints = await Complaint.countDocuments({ status: "In Progress" });
    const resolvedComplaints = await Complaint.countDocuments({ status: "Resolved" });
    const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;

    // 5. Visitor metrics
    const totalVisitors = await Visitor.countDocuments({});
    const activeVisitors = await Visitor.countDocuments({ checkOutTime: null });
    const checkedOutVisitors = totalVisitors - activeVisitors;

    // 6. Notice metrics
    const totalNotices = await Notice.countDocuments({});
    const latestNotice = await Notice.findOne({}).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Report summary fetched successfully",
      code: "success",
      status: "success",
      data: {
        totalStudents,
        activeStudents,
        totalRooms,
        occupiedRoomsCount,
        availableRoomsCount,
        roomOccupancyBreakdown,
        overallOccupancyPercent,
        totalRevenue,
        paymentHistory,
        studentFeeStatusList,
        complaints: {
          total: totalComplaints,
          pending: pendingComplaints,
          inProgress: inProgressComplaints,
          resolved: resolvedComplaints,
          resolutionRate,
        },
        visitors: {
          total: totalVisitors,
          active: activeVisitors,
          checkedOut: checkedOutVisitors,
        },
        notices: {
          total: totalNotices,
          latestDate: latestNotice?.createdAt ? new Date(latestNotice.createdAt).toLocaleDateString("en-GB") : "N/A",
        },
      },
    });

  } catch (error: any) {
    return next(error);
  }
};
