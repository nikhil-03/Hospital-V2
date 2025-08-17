import axios from "axios";
import { getUserServiceAPIs } from "../../apiConfig";

export const addUser = (user: any) => {
  console.log("user api", user);
  axios.post(getUserServiceAPIs().USERS_REGISTER, user);
};
