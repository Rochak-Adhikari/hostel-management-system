export function getBuildingGender(roomNumber: string): "Boys" | "Girls" | null {
  const prefix = roomNumber.trim().charAt(0).toUpperCase();
  if (prefix === "A") return "Boys";
  if (prefix === "B") return "Girls";
  return null;
}