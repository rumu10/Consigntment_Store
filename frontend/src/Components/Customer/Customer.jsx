import React, { useEffect, useState } from "react";
import { getDistance, orderByDistance } from "geolib";
import {
  Button,
  Row,
  Col,
  Form,
  Table,
  Select,
  Divider,
  Flex,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINT } from "../../config";
import CustomNotification from "../../Util/Notification/Notification";

const Customer = () => {
  const navigate = useNavigate();
  const { lat, long } = useParams();
  const [storeList, setStoreList] = useState([]);
  const [computerList, setComputerList] = useState(false);
  const [computerToCompare, setComputerToCompare] = useState(false);

  const [computerFilter] = Form.useForm();
  const [computerSelected] = Form.useForm();
  const [storeSelected] = Form.useForm();

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    fetchComputers();
  }, [storeList]);

  useEffect(() => {
    computerSelected.resetFields();
  }, [computerList]);


  // computer filter ralated
  const onResetComputerFilter = () => {
    console.log("Reset filter");
    computerFilter.resetFields();
    fetchComputers();
  };

  const objectToQueryString = (obj) => {
    return Object.entries(obj)
      .filter(([key, value]) => value !== undefined && value !== null)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join("&");
  };

  const onFinishComputerFilter = async () => {
    console.log("Apply filter");
    const filter = computerFilter.getFieldsValue();
    console.log("Filter to apply: ", filter);

    const filterStr = objectToQueryString(filter);
    console.log("Filter string:", filterStr);
    const { data } = await axios.get(`${API_ENDPOINT}computers?${filterStr}`);
    console.log("filtered data:", data);
    if (data) {
      let tabledata = expandRawComputerDataToFitComputerList(data.computers);
      setComputerList(tabledata);
      console.log("filtered data:", tabledata);
    }
  };

  // store related 
  const computeDistance = (lat1, long1, lat2, long2) => {
    let d = getDistance(
      { latitude: lat1, longitude: long1 },
      { latitude: lat2, longitude: long2 },
    ); // in meter
    let dmiles = d * 0.000621371; // convert to miles
    return ((dmiles * 0.868421052631579).toFixed(2)); //convert to nautical miles
  };

  const fetchStores = async () => {
    try {
      const { data } = await axios.get(`${API_ENDPOINT}stores?storeId=`);
      //console.log(data)
      if (data) {
        let stores = data.stores;
        stores = orderByDistance({ latitude: lat, longitude: long }, stores);
        let tabledata = stores.map((el, i) => {
          return {
            store: el,
            key: i,
            distance: computeDistance(lat, long, el.latitude, el.longitude), // in miles
          };
        });
        setStoreList(tabledata);
        //console.log(data.stores);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const storeTableRowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log('Selected Rows in store list:', selectedRows)
      storeSelected.setFieldsValue({ selectedStoreKey: selectedRowKeys });
    },
  };



  // computer list related
  const fetchComputerForStoreId = async (selectionId) => {
    let storeId = storeList[selectionId].store.storeId;
    const { data } = await axios.get(
      `${API_ENDPOINT}computers?storeId=${storeId}`,
    );
    if (data) {
      let tabledata = data.computers.map((el) => {
        return {
          ...el,
        };
      });
      return tabledata;
    }
  };

  const expandRawComputerDataToFitComputerList = (rawComputerData) => {
    let computers = rawComputerData.flat();
    //console.log(computers);
    let tabledata = computers.map((el, i) => {
      return {
        ...el,
        storeName: storeList.find((obj) => obj.store.storeId == el.storeId)
          .store.storeName,
        cost: (
          storeList.find((obj) => obj.store.storeId == el.storeId).distance *
          0.03
        ).toFixed(2),
        key: i,
      };
    });
    return tabledata;
  };

  const fetchComputers = async () => {
    //console.log('Success:', values.selectedStores);
    let value = storeSelected.getFieldsValue();
    let selected = value.selectedStoreKey;
    if (!selected || selected.length == 0) {
      selected = storeList.map((p) => p.key);
    }

    try {
      let allComputers = await Promise.all(
        selected.map(async (id) => {
          return await fetchComputerForStoreId(id);
        }),
      );
      if (allComputers) {
        let tabledata = expandRawComputerDataToFitComputerList(allComputers);
        console.log('tabledata:', tabledata)
        setComputerList(tabledata);
      }
    } catch {
      console.log("Error when fetching computer information.");
    }
  };

  const computerTableRowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      computerSelected.setFieldsValue({ selectedComputerKey: selectedRowKeys });
    },
  };

  // compare computer related
  const onExitCompare = () => {
    setComputerToCompare()
    computerSelected.resetFields();
  }

  const onFinishComputerSelection_Buy = async () => {
    const values = computerSelected.getFieldsValue();
    console.log("Computer Selected to Buy:", values);
    let selectedKey = values.selectedComputerKey;
    //console.log('selected computer key:', selectedKey)
    let selectedComputer = selectedKey.map(idx => computerList[idx]);
    console.log('Selected computer to buy:', selectedComputer)

    for (const computer of selectedComputer) {
      await buyAComputer(computer); // await is necessary here, to wait until buy is finished
                                    // otherwise, fetchComputers can get outdated data
    }
    fetchComputers();
  };

  const buyAComputer = async (computer) => {
    // send a status =1 request body with the computerId, to signal buying the comptuer
    let requestTobuyCode = {
      status: 1
    }
    await axios.put(`${API_ENDPOINT}update-computer/${computer.computerId}`, requestTobuyCode)
      .then(response => {
        console.log('response from buying computer: ', response);
        CustomNotification("Done!", "Computer \"" + computer.computerName + "\" Was Purchased Successfully", "success");
      })
      .catch(error => {
        console.error('Error from buying computer:', error);
        CustomNotification("Error!", "Computer \"" + computer.computerName + "\" Was not available.", "error");
      })
  }

  const onFinishComputerSelection_compare = () => {
    const values = computerSelected.getFieldsValue();
    console.log("Computer Selected to Compare:", values);
    let selectedKey = values.selectedComputerKey;
    let selectedComputer = selectedKey.map(idx => computerList[idx]);
    let compareResult = compareDataAndAppendResult(selectedComputer)
    setComputerToCompare(compareResult)
  };

  const compareDataAndAppendResult = (selectedComputer) => {
    const resultObj = {};
    Object.keys(selectedComputer[0]).forEach(field => {
      const isSame = selectedComputer.every(obj => obj[field] === selectedComputer[0][field]);
      resultObj[field] = isSame ? 'same' : 'different';
    });
    selectedComputer.push(resultObj);
    return (selectedComputer);
  }

  const onSignOut = () => {
    navigate("/login");
  };

  // filter options
  const PriceOption = [
    "$2,001 or more",
    "$1,501 - $2,000",
    "$1,001 - $1,500",
    "$501 - $1000",
    "$500 or less",
  ];
  const MemoryOption = [
    "32 GB or more",
    "12 GB",
    "16 GB",
    "8 GB",
    "4 GB or less",
  ];
  const StorageSizeOption = [
    "2 TB or more",
    "1 TB",
    "512 GB",
    "256 GB or less",
  ];
  const ProcessorsOption = ["All Intel Processors", "All AMD Processors"];
  const ProcessGenerationsOption = [
    "13th Gen Intel",
    "12th Gen Intel",
    "11th Gen Intel",
    "AMD Ryzen 7000 Series",
    "AMD Ryzen 6000 Series",
  ];
  const GraphicsOption = [
    "All NVIDIA Graphics",
    "All AMD Graphics",
    "All Intel Graphics",
  ];

  const storeListColumns = [
    {
      title: "Store Name",
      dataIndex: "store",
      key: "storeName",
      render: (store) => store.storeName,
    },
    {
      title: "Distance (miles)",
      dataIndex: "distance",
      key: "distance",
    },
  ]
  const ComputerColumns = [
    {
      title: "Model Name",
      dataIndex: "computerName",
      key: "name",
    },
    {
      title: "Store",
      dataIndex: "storeName",
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
      title: "Price ($)",
      dataIndex: "price",
      key: "name",
    },

    {
      title: "Shipping Cost($0.03/mile)",
      dataIndex: "cost",
      key: "name",
    },
  ];

  const generateFilterFormItem = (name, label, options) => (
    <Form.Item name={name} label={label}>
      <Select
        allowClear
        options={options.map((size) => ({ label: size, value: size }))}
      />
    </Form.Item>
  );

  return (
    <div className="customer" style={{ margin: "30px" }}>
      <Row>
        <Col className="gutter-row" lg={{ span: 6, offset: 0 }}>
          <Form
            form={computerFilter}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{
              maxWidth: 600,
              marginTop: "50px",
            }}
            //onFinish={onFinishComputerFilter}
            autoComplete="off"
          >
            <h2 style={{ textAlign: "center" }}>Computer Filters</h2>

            <Form.Item name="price" label="Price">
              <Select
                allowClear
                options={PriceOption.map((size) => ({
                  label: size,
                  value: size,
                }))}
              ></Select>
            </Form.Item>

            <Form.Item name="memory" label="Memory">
              <Select
                allowClear
                options={MemoryOption.map((size) => ({
                  label: size,
                  value: size,
                }))}
              ></Select>
            </Form.Item>

            <Form.Item name="storageSize" label="Storage Size">
              <Select
                allowClear
                options={StorageSizeOption.map((size) => ({
                  label: size,
                  value: size,
                }))}
              ></Select>
            </Form.Item>

            <Form.Item name="processors" label="Processors">
              <Select
                allowClear
                options={ProcessorsOption.map((size) => ({
                  label: size,
                  value: size,
                }))}
              ></Select>
            </Form.Item>

            <Form.Item name="processGenerations" label="Process Generations">
              <Select
                allowClear
                options={ProcessGenerationsOption.map((size) => ({
                  label: size,
                  value: size,
                }))}
              ></Select>
            </Form.Item>

            <Form.Item name="graphics" label="Graphics">
              <Select
                allowClear
                options={GraphicsOption.map((size) => ({
                  label: size,
                  value: size,
                }))}
              ></Select>
            </Form.Item>

            <Form.Item
              style={{ textAlign: "center" }}
              wrapperCol={{
                offset: 8,
                span: 4,
              }}
            >
              <Button
                type="primary"
                name="FilterButton"
                htmlType="submit"
                onClick={(e) => onFinishComputerFilter()}
              >
                Find Computer
              </Button>
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 4,
              }}
            >
              <Button
                type="primary"
                name="ResetButton"
                htmlType="submit"
                onClick={(e) => onResetComputerFilter()}
              >
                Remove Filter
              </Button>
            </Form.Item>
          </Form>

          <Form form={storeSelected}
            style={{ textAlign: "center" }}
            name="storeList"
            //onFinish={fetchComputers}
            //labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            layout={"Horizontal"}
          //style={{ maxWidth: 200 }}
          >
            <h2 style={{ textAlign: "center" }}>
              Store List by distance (miles){" "}
            </h2>
            <Form.Item style={{ textAlign: "center" }} name="selectedStoreKey">
              <Table
                rowSelection={storeTableRowSelection}
                rowKey={(storeList) => storeList.key}
                dataSource={storeList}
                columns={storeListColumns}
              />
            </Form.Item>
            <Form.Item label=" " colon={false} style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit" onClick={(e) => fetchComputers()}>
                Generate Inventory
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col className="gutter-row" lg={{ span: 8, offset: 1 }}>
          <h2 style={{ textAlign: "center" }}>Computer List</h2>

          <Form form={computerSelected}>
            <Form.Item name="selectedComputerKey">
              <Table
                rowSelection={computerTableRowSelection}
                rowKey={(computerList) => computerList.key}
                dataSource={computerList}
                columns={ComputerColumns}
              />
            </Form.Item>

            <Flex gap="small" wrap="wrap" style={{ marginLeft: "150px" }}>
              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={(e) => onFinishComputerSelection_Buy()}
                >
                  Buy Selected
                </Button>

              </Form.Item>


              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button
                  type="primary"
                  name="Store"
                  htmlType="submit"
                  onClick={(e) => onFinishComputerSelection_compare()}
                >
                  Compare Selected
                </Button>
              </Form.Item>
            </Flex>
          </Form>
          <br></br>

          <h2 style={{ textAlign: "center" }}>Compare Computer</h2>
          <Form>
            <Form.Item >
              <Table
                dataSource={computerToCompare}
                columns={ComputerColumns}
              />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button
                type="primary"
                name="Store"
                htmlType="submit"
                onClick={(e) => onExitCompare()}
              >
                Exit Compare
              </Button>
            </Form.Item>
          </Form>

        </Col>

        <Col className="gutter-row" lg={{ span: 5, offset: 1 }}>
          <Button type="primary" block onClick={onSignOut}>
            SignOut
          </Button>
          <Divider />
        </Col>
      </Row>
    </div>

    // {/* This is the page for customer */ }
  );
};

export default Customer;