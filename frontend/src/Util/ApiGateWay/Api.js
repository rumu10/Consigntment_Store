import axios from "axios";

const AuthAPI = axios.create({
  baseURL: process.env.REACT_APP_log_in,
});

export { AuthAPI };
