import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export const useUserStore = create(
  immer((set) => ({
    username: "",
    password: "",
    token: "",
    errMsg: "",
    setUsername: (e) => set(() => ({ username: e })),
    setPassword: (e) => set(() => ({ password: e })),
    setToken: (e) => set(() => ({ token: e })),
    setErrMsg: (e) => set(() => ({ errMsg: e }))
  }))
)