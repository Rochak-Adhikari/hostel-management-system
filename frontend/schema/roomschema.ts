import * as yup from "yup";

export const RoomSchema = yup.object({
  RoomNumber: yup.string()
    .required("Room number is required"),
  block: yup.string().required("Block is required").oneOf(["A", "B", "C", "D", "E"], "Block must be A, B, C, D, or E"),
  Floor: yup.string().required("Floor is required"),
  RoomType: yup.string().required("Room Type is required"),
  Capacity: yup.number().typeError("Capacity must be a number").required("Capacity is required").min(1, "Capacity must be at least 1"),
  Occupied: yup.number().typeError("Occupied must be a number").min(0, "Occupied cannot be negative").default(0),
  MonthlyFee: yup.number().typeError("Monthly fee must be a number").required("Monthly fee is required"),
});