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

export const login = (body) => {
  //  phone_number: `+91${formData.phone}`,
  //       password: formData.password,
  const formData = new FormData();
  formData.append("phone_number", body.phone_number);
  formData.append("password", body.password);
  return API.post(`${LOGIN}`, formData);
};

export const user_register = (body) => API.post(`${USER_REGISTER}`, body);

export const driver_register = (body) => {
  console.log(body);
  return API.post(`${DRIVER_REGISTER}`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const logout = () => API.post(`${LOGOUT}`);
