import * as API from "../index";

export const requestCar = async (body) => {
  try {
    const res = await API.request_car(body);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const acceptRequest = async (id) => {
  try {
    const res = await API.accept_request(id);
    return res.data;
  } catch (error) {
    return error;
  }
};
