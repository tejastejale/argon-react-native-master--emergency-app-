import axios from "axios";
import {
  BASE,
  DRIVER_REGISTER,
  LOGIN,
  LOGOUT,
  USER_REGISTER,
} from "./constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use(async (req) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Token ${token}`; // Add Token as the prefix
  }
  return req;
});

export const login = (body) => API.post(`${LOGIN}`, body);

export const user_register = (body) => API.post(`${USER_REGISTER}`, body);

export const driver_register = (body) => API.post(`${DRIVER_REGISTER}`, body);

export const logout = () => API.post(`${LOGOUT}`);
