import AsyncStorage from "@react-native-async-storage/async-storage";
import { user_register } from "..";

export const userRegister = async (body) => {
  try {
    const res = await user_register(body);
    // const set = await AsyncStorage.setItem("token", res);
    return res;
  } catch (error) {
    return error;
  }
};
