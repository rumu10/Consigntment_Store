import React, { useEffect, useState } from "react";
import { getDistance, orderByDistance } from "geolib"
import { Button, Row, Col, Form, Table, Select, Checkbox, Divider, Flex, Space } from 'antd';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { API_ENDPOINT } from '../../config';

const Customer = () => {

    const navigate = useNavigate();
    const { lat, long } = useParams();
    const [storeList, setStoreList] = useState([]);
    const [computerList, setComputerList] = useState(false);

    const onFinish_filterComputer = (values) => {
        console.log("filter the features:", values);
        // todo: add logic to add computer to the databas
    }

    useEffect(() => {
        fetchStores();
    }, []);

    const computeDistance = (lat1, long1, lat2, long2) => {
        let d = getDistance({ latitude: lat1, longitude: long1 },
            { latitude: lat2, longitude: long2 })  // in meter
        return d * 0.000621371; // convert to miles
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
                        distance: computeDistance(lat, long, el.latitude, el.longitude) // in miles
                    }
                })
                setStoreList(tabledata);
                //console.log(data.stores);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    const fetchComputerForStoreId = async (selectionId) => {
        let storeId = storeList[selectionId].store.storeId;
        const { data } = await axios.get(`${API_ENDPOINT}computers?storeId=${storeId}`);
        if (data) {
            let tabledata = data.computers.map((el) => {
                return {
                    ...el,
                    selectionId: selectionId
                }
            })
            return tabledata;
        }
    }

    const fetchComputers = async (values) => {
        //console.log('Success:', values.selectedStores);
        let selected = values.selectedStores;

        try {
            let allComputers = await Promise.all(selected.map(async (id) => {
                return (await fetchComputerForStoreId(id));
            }))
            if (allComputers) {
                let computers = allComputers.flat();
                //console.log(computers);
                let tabledata = computers.map((el, i) => {
                    let selected = el.selectionId
                    return {
                        ...el,
                        storeName: storeList[selected].store.storeName,
                        cost: (storeList[selected].distance * 0.03).toFixed(2),
                        key: i
                    }
                })
                //console.log('tabledata:', tabledata)
                setComputerList(tabledata);
            }
        }
        catch {
            console.log("Error when fetching computer information.")

        }

    }

    const [computerSelected] = Form.useForm();
    //computerSelected.setFieldsValue({item: computerList})

    const tableRowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            computerSelected.setFieldsValue({ selectedComputerKey: selectedRowKeys })
            //            console.log(
            //                `selectedRowKeys: ${selectedRowKeys}`,
            //                "selectedRows: ",
            //                selectedRows
            //           )
        },
        getCheckboxProps: record => console.log(record)
    };

    const onFinishComputerSelection = (action) => {
        const values = computerSelected.getFieldsValue();

        console.log('Computer Selected:', values, action);

        if (action == 'buy') {
            console.log('Buy computer: ', values)
        }
        else {
            console.log('Compare computer: ', values)
        }
    }

    const onSignOut = () => {
        navigate('/login')
    }

    // filter options
    const PriceOption = ['$2,001 or more', '$1,501 - $2,000', '$1,001 - $1,500', '$501 - $1000', '$500 or less']
    const MemoryOption = ["32 GB or more", "16 GB", "8 GB", "4 GB or less"]
    const StorageSizeOption = ["2 TB or more", "1 TB", "512 GB", "256 GB or less"]
    const ProcessorsOption = ["All Intel Processors", "All AMD Processors"]
    const ProcessGenerationsOption = ["13th Gen Intel", "12th Gen Intel", "11th Gen Intel", "AMD Ryzen 7000 Series", "AMD Ryzen 6000 Series"]
    const GraphicsOption = ["All NVIDIA Graphics", "All AMD Graphics", "All Intel Graphics"]


    //    // computer list
    //    // todo: currently these are mocked computer list data, we need to query these data from the database
    //    const computerList = [
    //
    //        {
    //            key: '1',
    //            computerName: 'Computer 2',
    //            storeName: 'Store 4',
    //            memory: '8GB',
    //            storageSize: '1TB',
    //            processors: 'Intel i9',
    //            processGenerations: "12th Gen Intel",
    //            graphics: 'NVIDIA GeForce RTX 4080',
    //
    //            price: 329.99,
    //            cost: 1,
    //
    //        },
    //    ];

    const columns = [
        {
            title: 'Model Name',
            dataIndex: 'computerName',
            key: 'name',

        },
        {
            title: 'Store',
            dataIndex: 'storeName',
            key: 'name',

        },
        {
            title: 'Memory',
            dataIndex: 'memory',
            key: 'name',

        },
        {
            title: 'Storage',
            dataIndex: 'storageSize',
            key: 'name',

        },
        {
            title: 'Processor',
            dataIndex: 'processors',
            key: 'name',

        },
        {
            title: 'Generations',
            dataIndex: 'processGenerations',
            key: 'name',

        },
        {
            title: 'Graphics',
            dataIndex: 'graphics',
            key: 'name',

        },

        {
            title: 'Price ($)',
            dataIndex: 'price',
            key: 'name',

        },

        {
            title: 'Shipping Cost($0.03/mile)',
            dataIndex: 'cost',
            key: 'name',

        },

    ];

    return (
        <div className='customer' style={{ margin: '30px' }}>

            <Row>
                <Col className="gutter-row" lg={{ span: 6, offset: 0 }}>

                    <Form
                        name="basic"
                        labelCol={{ span: 8, }}
                        wrapperCol={{ span: 16, }}
                        style={{
                            maxWidth: 600, marginTop: "50px"
                        }}
                        onFinish={onFinish_filterComputer}
                        autoComplete="off"
                    >

                        <h2 style={{ textAlign: 'center' }}>Computer Filters</h2>

                        <Form.Item
                            name="price"
                            label="Price"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                options={PriceOption.map((size) => ({ label: size, value: size }))}
                            >
                            </Select>
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
                                options={MemoryOption.map((size) => ({ label: size, value: size }))}
                            >
                            </Select>
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
                                options={StorageSizeOption.map((size) => ({ label: size, value: size }))}
                            >
                            </Select>
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
                                options={ProcessorsOption.map((size) => ({ label: size, value: size }))}
                            >
                            </Select>
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
                                options={ProcessGenerationsOption.map((size) => ({ label: size, value: size }))}
                            >
                            </Select>
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
                                options={GraphicsOption.map((size) => ({ label: size, value: size }))}
                            >
                            </Select>
                        </Form.Item>

                        <Form.Item style={{ textAlign: 'center' }}>
                            <Button type="primary" htmlType="submit" >
                                Find Computers
                            </Button>
                        </Form.Item>
                    </Form>


                    <Form style={{ textAlign: 'center' }}
                        name="storeList"
                        onFinish={fetchComputers}
                        //labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        layout={'Horizontal'}
                    //style={{ maxWidth: 200 }}
                    >

                        <h2 style={{ textAlign: 'center' }}>Store List by distance (miles) </h2>
                        <Form.Item style={{ textAlign: 'center' }} name="selectedStores" >
                            <Checkbox.Group style={{ width: 250 }} options={storeList.map((p) => ({ label: p.store.storeName.concat(',', p.distance.toFixed(2)), value: p.key }))}>
                            </Checkbox.Group>
                        </Form.Item>
                        <Form.Item label=" " colon={false} style={{ textAlign: 'center' }}>
                            <Button type="primary" htmlType="submit">
                                Generate Inventory
                            </Button>
                        </Form.Item>
                    </Form>

                </Col>
                <Col className="gutter-row" lg={{ span: 8, offset: 1 }}>
                    <h2 style={{ textAlign: 'center' }}>Computer List</h2>

                    <Form form={computerSelected}>
                        <Form.Item name="selectedComputerKey">
                            <Table rowSelection={tableRowSelection} rowKey={(computerList) => computerList.key} dataSource={computerList} columns={columns} />
                        </Form.Item>

                        <Flex gap="small" wrap="wrap" style={{ marginLeft: '150px' }}>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" name="SiteManager" htmlType="submit" onClick={e => onFinishComputerSelection('buy')}>
                                    Buy Selected
                                </Button>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" name="Store" htmlType="submit" onClick={e => onFinishComputerSelection('compare')}>
                                    Compare Selected
                                </Button>
                            </Form.Item>
                        </Flex>
                    </Form>
                    <br></br>

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

    )
}

export default Customer