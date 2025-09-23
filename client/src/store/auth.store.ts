import { create } from "zustand";
import { loginUser, fetchProfile } from "@/features/auth/api/auth.api";
import { devtools } from "zustand/middleware";
import { IUser } from "@/shared/interfaces/IUser";

interface AuthState {
    accessToken: string | null;
    user: IUser | null;
    isLoading: boolean;

    login: (username: string, password: string) => Promise<void>;
    fetchProfile: () => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    devtools((set, get) => ({
        accessToken: typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
        user: null,
        isLoading: false,

        login: async (username, password) => {
            set({ isLoading: true });
            try {
                const data = await loginUser({ username, password });

                const accessToken = data.data?.accessToken;

                if (accessToken) {
                    localStorage.setItem("accessToken", accessToken);
                } else {
                    throw new Error("No access token received");
                }

                set({ accessToken });

                await get().fetchProfile();
            } catch (err) {
                console.error("Login error:", err);
                throw err;
            } finally {
                set({ isLoading: false });
            }
        },

        fetchProfile: async () => {
            const token = get().accessToken;
            if (!token) return;

            try {
                const user = await fetchProfile(token);
                set({ user });
            } catch (err) {
                console.error("Fetch profile error:", err);
                set({ user: null, accessToken: null });
                localStorage.removeItem("accessToken");
            }
        },

        logout: () => {
            localStorage.removeItem("accessToken");
            set({ accessToken: null, user: null });
        },
    }))
);
