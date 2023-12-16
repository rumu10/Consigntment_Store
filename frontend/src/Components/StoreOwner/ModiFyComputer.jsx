import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  Form,
  InputNumber,
  Input,
  Table,
  Select,
  Spin,
  Flex,
  Modal,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import CustomNotification from "../../Util/Notification/Notification";
import axios from "axios";
import { API_ENDPOINT } from "../../config";


const ModiFyComputer = ({computerObj, onUpdateSuccess}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [updateForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [computerID, setComputerID] = useState(false);


  const MemoryOption = ["32 GB", "16 GB", "12 GB", "8 GB", "4 GB", "1 GB"];
  const StorageSizeOption = ["2TB", "1TB", "4TB", "512 GB", "256 GB", "128 GB"];
  const ProcessorsOption = [
    "Intel Xeon",
    "Intel i9",
    "Intel i7",
    "AMD Ryzen 9",
    "AMD Ryzen 7",
  ];
  const ProcessGenerationsOption = [
    "13th Gen Intel",
    "12th Gen Intel",
    "11th Gen Intel",
    "AMD Ryzen 7000 Series",
    "AMD Ryzen 6000 Series",
  ];
  const GraphicsOption = [
    "NVIDIA GeForce RTX 4090",
    "NVIDIA GeForce RTX 4080",
    "AMD Radeon Pro W6300",
    "AMD Radeon Pro W6400",
    "Integrated Graphics",
    "Intel UHD Graphics 730",
    "Intel UHD Graphics 770",
  ];



    useEffect(() => {
    setComputerID(computerObj?.computerId)
    updateForm.setFieldsValue({
        computerName: computerObj?.computerName,
        memory: computerObj?.memory,
        storageSize:computerObj?.storageSize,
        processors:computerObj?.processors,
        processGenerations :computerObj?.processGenerations,
        graphics:computerObj?.graphics,
        price:computerObj?.price
    })
  }, [computerObj]);

  const onFinish_updateComputer = async (computer) => {
    setLoading(true)
      computer.computerID = computerID;
  
    await axios.put(`${API_ENDPOINT}update-computer/${computer.computerID}`, computer)
      .then(response => {
        console.log('response from updating computer: ', response);
        CustomNotification("Done!", "Computer information updated Successfully", "success");
        onUpdateSuccess();
        setLoading(false);
      })
      .catch(error => {
        console.error('Error from buying computer:', error);
        CustomNotification("Error!", "updating Computer \"" + computer.computerName + "\" failed." + error.response.data.message, "error");
      })
  }


  return (
    <Spin spinning={loading}>
      <div className="store-owner" style={{ margin: "30px" }}>
        <Row>
          <Col className="gutter-row" lg={{ span: 24, offset: 0 }}>
            <Form
              name="update"
              labelCol={{ span: 8}}
              wrapperCol={{ span: 16 }}
              style={{
                maxWidth: 600,
                marginTop: "50px",
              }}
              onFinish={onFinish_updateComputer}
              form={updateForm}
            >
              <Form.Item
                name="computerName"
                label="Computer Name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="memory"
                label="Memory"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  allowClear
                  options={MemoryOption.map((size) => ({
                    label: size,
                    value: size,
                  }))}
                ></Select>
              </Form.Item>

              <Form.Item
                name="storageSize"
                label="Storage Size"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  allowClear
                  options={StorageSizeOption.map((size) => ({
                    label: size,
                    value: size,
                  }))}
                ></Select>
              </Form.Item>

              <Form.Item
                name="processors"
                label="Processors"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  allowClear
                  options={ProcessorsOption.map((size) => ({
                    label: size,
                    value: size,
                  }))}
                ></Select>
              </Form.Item>

              <Form.Item
                name="processGenerations"
                label="Process Generations"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  allowClear
                  options={ProcessGenerationsOption.map((size) => ({
                    label: size,
                    value: size,
                  }))}
                ></Select>
              </Form.Item>

              <Form.Item
                name="graphics"
                label="Graphics"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  allowClear
                  options={GraphicsOption.map((size) => ({
                    label: size,
                    value: size,
                  }))}
                ></Select>
              </Form.Item>
              <Form.Item
                name="price"
                label="Price"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item style={{ textAlign: "center" }}>
                <Button type="primary" htmlType="submit">
                        Update Computer
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default ModiFyComputer;
