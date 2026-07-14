// room ko Capacity anusar bed letters generate garne (a, b, c...)
export function getBedList(capacity: number): string[] {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  return letters.slice(0, capacity).split("");
}
