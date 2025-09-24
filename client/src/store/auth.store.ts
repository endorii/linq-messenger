import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AuthState {}

export const useAuthStore = create<AuthState>()(devtools((set, get) => ({})));
