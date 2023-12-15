import React, { useState } from "react";
import { Button, Row, Col, Form, Input, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINT } from "../../config";
import CustomNotification from "../../Util/Notification/Notification";

const CreateStore = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish_CreateStore = async (values) => {
    console.log("registering store for: ", values);
    values.managerId = 1;

    // setLoading(true);
    try {
      const { data } = await axios.post(`${API_ENDPOINT}create-stores`, values);
      console.log(data);
      if (data) {
        CustomNotification("Done!", "Store Added Successfully", "success");
        form.resetFields();
        setLoading(false);
      } else {
        console.log("eerrrr adding stores");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onSignOut = () => {
    navigate("/login");
  };

  return (
    <Spin spinning={loading}>
      <div className="CreateStorePage">
        <h2 style={{ textAlign: "center" }}>Register Your New Store</h2>
        <br />
        <br />
        <br />

        <Row type="flex" justify="center" align="middle">
          <Col>
            <Form
              name="basic"
              form={form}
              style={{
                maxWidth: 400,
              }}
              onFinish={onFinish_CreateStore}
              autoComplete="off"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password_hash"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Store Name"
                name="storeName"
                rules={[
                  {
                    required: true,
                    message: "Please input the store name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Latitude"
                name="latitude"
                rules={[
                  {
                    required: true,
                    message: "Please input your lat!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Longitude"
                name="longitude"
                rules={[
                  {
                    required: true,
                    message: "Please input your long!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <div
                gap="small"
                wrap="wrap"
                style={{ marginLeft: "0px", textAlign: "center" }}
              >
                <Form.Item>
                  <Button type="primary" name="StoreOwner" htmlType="submit">
                    Register Store
                  </Button>
                </Form.Item>
                <Button type="primary" block onClick={onSignOut}>
                  Go Back to Login
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default CreateStore;
