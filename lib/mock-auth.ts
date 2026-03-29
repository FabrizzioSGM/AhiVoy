// Mock auth context — replace with Supabase Auth in production
import { seedUsers } from "./seed-data";
import type { User } from "./types";

export function getMockUser(role: "embarcador" | "transportista" | "admin" = "embarcador"): User {
  const user = seedUsers.find((u) => u.role === role);
  return user ?? seedUsers[0];
}

export const mockShipper = seedUsers.find((u) => u.role === "embarcador")!;
export const mockCarrier = seedUsers.find((u) => u.role === "transportista")!;
export const mockAdmin = seedUsers.find((u) => u.role === "admin")!;
