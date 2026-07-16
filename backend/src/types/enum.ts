export enum Role {
  STUDENT = "student",
  GUARDIAN = "guardian",
  ADMIN = "admin",
}

export enum ErrorCodes {
  NOT_FOUND = "Not Found",
  VALIDATION_ERROR = "Validation Error",
  SERVER_ERROR = "Server Error",
  ACCOUNT_ALREADY_EXISTS = "Account Already Exists",
  INVALID_CREDENTIALS = "Invalid Credentials",
  ROOM_NOT_FOUND = "Room Not Found",
  ROOM_ALREADY_EXISTS = "Room Already Exists",
  ROOM_FULL = "Room Full",
  ROOM_NOT_AVAILABLE = "Room Not Available",
  ALLOCATION_NOT_FOUND = "Allocation Not Found",
  ALLOCATION_ALREADY_EXISTS = "Allocation Already Exists",
  ALLOCATION_NOT_AVAILABLE = "Allocation Not Available",
  ALLOCATION_FULL = "Room Full",
  COMPLAINT_NOT_FOUND = "Complaint Not Found",
  NOTICE_NOT_FOUND = "Notice Not Found",
  NOTICE_ALREADY_EXISTS = "Notice Already Exists",
  NOTICE_NOT_AVAILABLE = "Notice Not Available",
  NOTICE_FULL = "Notice Full",
  VISITOR_NOT_FOUND = "Visitor Not Found",
  VISITOR_ALREADY_EXISTS = "Visitor Already Exists",
  VISITOR_NOT_AVAILABLE = "Visitor Not Available",
  VISITOR_FULL = "Visitor Full",
  FEE_NOT_FOUND = "Fee Not Found",
  FEE_ALREADY_EXISTS = "Fee Already Exists",
  FEE_NOT_AVAILABLE = "Fee Not Available",
  FEE_FULL = "Fee Full",
}

export enum RoomType {
  SINGLE = "Single",
  DOUBLE = "Double",
  TRIPLE = "Triple",
  QUAD = "Quadruple",
}

export enum RoomGender {
  BOYS = "Boys",
  GIRLS = "Girls",
}

export enum Block {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
}

export enum ComplaintStatus {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  RESOLVED = "Resolved",
}

export enum NoticeCategory {
  GENERAL = "General",
  MAINTENANCE = "Maintenance",
  FEE = "Fee",
  EVENT = "Event",
}

export enum feeStatus {
  UNPAID = "Unpaid",
  PAID = "Paid",
  OVERDUE = "Overdue",
}