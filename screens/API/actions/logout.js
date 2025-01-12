import { logout } from "..";

export const makeLogout = async () => {
  try {
    const res = await logout();
    return res.data;
  } catch (error) {
    return error;
  }
};
