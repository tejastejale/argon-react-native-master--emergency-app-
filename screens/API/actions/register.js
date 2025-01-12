import { user_register } from "..";

export const userRegister = async (body) => {
  try {
    const res = await user_register(body);
    return res.data;
  } catch (error) {
    return error;
  }
};
