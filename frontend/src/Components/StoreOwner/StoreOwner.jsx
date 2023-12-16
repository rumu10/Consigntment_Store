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
import ModiFyComputer from "./ModiFyComputer";

const { confirm } = Modal;

const StoreOwner = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [computerList, setComputerList] = useState(false);
  const [storeName, setStoreName] = useState(id);

  const [totalInventory, setTotalInventory] = useState(0);
  const [totalBalance, setTotalbalance] = useState(0);
  const [computer, setComputer] = useState(false);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');

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

  const columns = [
    {
      title: "Serial#",
      dataIndex: "key",
      key: "name",
    },
    {
      title: "Model Name",
      dataIndex: "computerName",
      key: "name",
    },
    {
      title: "Memory",
      dataIndex: "memory",
      key: "name",
    },
    {
      title: "Storage",
      dataIndex: "storageSize",
      key: "name",
    },
    {
      title: "Processor",
      dataIndex: "processors",
      key: "name",
    },
    {
      title: "Generations",
      dataIndex: "processGenerations",
      key: "name",
    },
    {
      title: "Graphics",
      dataIndex: "graphics",
      key: "name",
    },
    {
      title: "Price ($$)",
      dataIndex: "price",
      key: "name",
    },
    {
      title: "",
      dataIndex: "",
      key: "x",
      render: (text, record) => (
        <>
          <Flex gap="small" wrap="wrap">
            <Button
              size="small"
              style={{ background: "#68D120" }}
              type="primary"
              onClick={(e) => showModal(record)}
            // onClick={(e) => onModifyComputer(record)}
            >
              Modify
            </Button>
            <Button
              size="small"
              type="primary"
              danger
              onClick={(e) => onRemoveComputer(record)}
            >
              Remove
            </Button>
          </Flex>
        </>
      ),
    },
  ];

  const showModal = (record) => {
    setComputer(record);
    setOpen(true);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
    setComputer(null);

  };


  const handleUpdateSuccess = () => {
    setComputer(null);
    setOpen(false);
  };



  const onRemoveComputer = async (record) => {
    confirm({
      title: "Do you want to delete this computer?",
      icon: <ExclamationCircleOutlined />,
      // content: 'When clicked the OK button, this dialog will be closed after 1 second',
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        var computerId = record.computerId;
        try {
          const { data } = await axios.delete(
            `${API_ENDPOINT}computers/${computerId}`,
          );
          console.log(data);
          if (data) {
            fetchComputers();
          } else {
            console.log("eerrrr login site managerrrr");
          }
        } catch (e) {
          console.log(e);
        }
      },
      onCancel() { },
    });
  };

  useEffect(() => {
    fetchComputers();
    fetchStoreInfo();
  }, [computer]);

  const fetchStoreInfo = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_ENDPOINT}stores?storeId=${id}`);
      if (data) {
        setStoreName(data.stores[0].storeName);
        setTotalInventory(data.stores[0].inventory);
        setTotalbalance(data.stores[0].balance);
      } else {
        setStoreName(id);
        console.log("Errrr: Fetch store information error.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchComputers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_ENDPOINT}computers?storeId=${id}`,
      );
      // console.log(data);
      if (data) {
        let tabledata = data?.computers?.map((el, i) => {
          return {
            ...el,
            key: i + 1,
          };
        });

        setComputerList(tabledata);
        fetchStoreInfo();
        setLoading(false);
      } else {
        console.log("eerrrr login site manager");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onFinish_addComputer = async (values) => {
    // console.log("computer to add:", values);
    // todo: add logic to add computer to the database
    values.storeId = id;
    values.status = 0;
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_ENDPOINT}add-computers`, values);
      // console.log(data);
      if (data) {
        CustomNotification("Done!", "Computer Added Successfully", "success");
        form.resetFields();
        fetchComputers();
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
      <div className="store-owner" style={{ margin: "30px" }}>
        <Row>
          <Col className="gutter-row" lg={{ span: 5, offset: 0 }}>
            <h2 style={{ textAlign: "center" }}>
              Add Computer to: {storeName}
            </h2>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{
                maxWidth: 600,
                marginTop: "50px",
              }}
              onFinish={onFinish_addComputer}
              form={form}
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
                  Add Computer
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col className="gutter-row" lg={{ span: 13, offset: 1 }}>
            <h2 style={{ textAlign: "center" }}>Computer List</h2>
            <Table dataSource={computerList} columns={columns} />
          </Col>
          <Col className="gutter-row" lg={{ span: 4, offset: 1 }}>
            <Button type="primary" block onClick={onSignOut}>
              SignOut
            </Button>
            <h2
              style={{
                textAlign: "center",
                marginTop: "70px",
                fontSize: "14px",
              }}
            >
              Store Balance:
            </h2>
            <div
              style={{
                textAlign: "center",
                marginTop: "10px",
                fontSize: "24px",
              }}
            >
              ${totalBalance}
            </div>
            <h2
              style={{
                textAlign: "center",
                marginTop: "70px",
                fontSize: "14px",
              }}
            >
              Store Inventory:
            </h2>
            <div
              style={{
                textAlign: "center",
                marginTop: "10px",
                fontSize: "24px",
              }}
            >
              ${totalInventory}
            </div>
          </Col>
        </Row>
      </div>
      <Modal
        title="Update Computer Information"
        maskClosable={false}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={null}
      >
        <ModiFyComputer computerObj={computer} onUpdateSuccess={handleUpdateSuccess} />
      </Modal>
    </Spin>
  );
};

export default StoreOwner;
