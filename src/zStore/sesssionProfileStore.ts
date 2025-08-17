import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

interface IPubSessionProfile {
  tokem: string;
  setTokem: (tokem: string) => void;
  userCorrente: any;
  setUserCorrente: (user: any) => void;
}
enum UserRole {
  USERAPP = "USERAPP",
}

export const UseSessionProfileStore = create<IPubSessionProfile>()(
  devtools(
    persist(
      (set) => ({
        tokem: "",
        setTokem: (t: string) => set(() => ({ tokem: t })),
        setUserCorrente: (user: any) =>
          set(() => ({
            userCorrente: user,
          })),

        pubs: [],
        userCorrente: {
          id: "",
          nome: "",
          email: "",
          role: UserRole.USERAPP,
        },
      }),
      {
        name: "_zPUBStoreSession",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          userCorrente: state.userCorrente,
          tokem: state.tokem,
        }),
      }
    )
  )
);
