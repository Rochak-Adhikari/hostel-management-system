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