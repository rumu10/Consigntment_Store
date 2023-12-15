import { notification } from "antd";

const CustomNotification = (message, description, type) => {
  notification[type]({
    message: message,
    description: description,
  });
};
export default CustomNotification;
