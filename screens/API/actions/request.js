import * as API from "../index";

export const requestCar = async (body) => {
  try {
    const res = await API.request_car(body);
    return res.data;
  } catch (error) {
    return error;
  }
};
