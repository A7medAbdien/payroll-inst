import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { User } from '@/types';

interface UserStore {
  user: User | null;
  loading: boolean;
  error: Error | null;
  fetchUser: () => Promise<void>;
}

// Mock user data
const mockUser: User = {
  name: "DEMO_USER",
  first_name: "Demo",
  full_name: "Demo User",
  user_image: "/assets/hr_bh/images/default-user.png",
  roles: ["HR Manager", "System Manager"]
};

export const useUserStore = create<UserStore>()(
  devtools(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      fetchUser: async () => {
        set({ loading: true });
        try {
          // TODO: Implement actual Frappe call here
          // const response = await window.frappe.call({
          //   method: 'hr_bh.api.get_current_user_info'
          // });
          // set({ user: response.message, loading: false });

          // For demo, use mock data
          setTimeout(() => {
            set({ user: mockUser, loading: false });
          }, 500);
        } catch (error) {
          set({ error: error as Error, loading: false });
        }
      },
    }),
    { name: 'user-store' }
  )
);