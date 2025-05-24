"use client";

import { atom } from "recoil";

export interface UserInfo {
  uid: string;
  email: string;
  nickname: string;
}

export const userAtom = atom<UserInfo | null>({
  key: "userAtom",
  default: null,
});

export const selectedPostIdAtom = atom<string | null>({
  key: "selectedPostIdAtom",
  default: null,
});

export const selectedChatIdAtom = atom<string | null>({
  key: "selectedChatIdAtom",
  default: null,
});
