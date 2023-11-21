import { Row, Col, Table, Button, Spin, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { API_ENDPOINT } from '../../config';

const { confirm } = Modal;

const SiteManager = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [storeList, setStoreList] = useState([]);
    const [storeBalanceList, setStoreBalanceList] = useState([]);
    const [storeIncentoryList, setStoreInventoryList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [totalInventory, setTotalInventory] = useState(0);
    const [totalBalance, setTotalbalance] = useState(0);
    const [managerBalance, setManagerbalance] = useState(0);

    useEffect(() => {

        console.log(id);
        fetchStores();

    }, []);

    const fetchStores = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_ENDPOINT}stores?storeId=`);
            if (data) {
                let tabledata = data?.stores?.map((el, i) => {
                    return {
                        ...el,
                        key: i + 1
                    }
                })

                setStoreList(tabledata);
                setStoreBalanceList(tabledata);
                setStoreInventoryList(tabledata);
                setLoading(false);

            } else {
                console.log("eerrrr login site manager")
            }

            fetchTotal();

        } catch (e) {
            console.log(e);
        }
    }

    const fetchTotal = async () => {
        console.log('total')
        try {
            const { data } = await axios.get(`${API_ENDPOINT}managers`);
            if (data.totals.length > 0) {
                setTotalInventory(data?.totals[0].total_inventory);
                setTotalbalance(data?.totals[0].total_balance);
                setManagerbalance(data?.totals[0].manager_balance);
                setLoading(false);

            } else {
                setTotalInventory(0);
                setTotalbalance(0);
                setManagerbalance(0);
                setLoading(false);
            }

        } catch (e) {
            console.log(e);
        }
    }

    const columnsI = [
        {
            title: 'Store Name',
            dataIndex: 'storeName',
            key: 'name',
        },
        {
            title: 'Inventory($$)',
            dataIndex: 'inventory',
            key: 'inventory',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.inventory - b.inventory,
            sortDirections: ['descend', 'ascend', 'descend']
        },

    ];

    const columnsB = [
        {
            title: 'Store Name',
            dataIndex: 'storeName',
            key: 'name',
        },
        {
            title: 'Balance($$)',
            dataIndex: 'balance',
            key: 'balance',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.balance - b.balance,
            sortDirections: ['descend', 'ascend', 'descend']
        },

    ];

    const columns = [
        {
            title: 'Store Name',
            dataIndex: 'storeName',
            key: 'name',
        },
        {
            title: '',
            width: '25%',
            dataIndex: '',
            key: 'x',
            render: (text, record) => (
                <>
                    <Button type="primary" danger
                        onClick={() => onRemoveStore(record)}
                    >
                        Remove Store
                    </Button>

                </>
            ),
        },

    ];

    const onRemoveStore = async (record) => {
        confirm({
            title: 'Do you want to delete this store?',
            icon: <ExclamationCircleOutlined />,
            // content: 'When clicked the OK button, this dialog will be closed after 1 second',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                var store_id = record.storeId
                try {
                    const { data } = await axios.delete(`${API_ENDPOINT}stores/${store_id}`);
                    console.log(data);
                    if (data) {
                        fetchStores();

                    } else {
                        console.log("eerrrr login site managerrrr")
                    }

                } catch (e) {
                    console.log(e);
                }
            },
            onCancel() { },
        });
    };

    const onSignOut = () => {
        navigate('/login')
    }
    return (
        <Spin spinning={loading}>
            <div className='site-manager' style={{ margin: '30px' }}>

                <Row>
                    <Col className="gutter-row" lg={{ span: 5, offset: 0 }}>
                        <h2 style={{ textAlign: 'center' }}>Store List</h2>
                        <Table dataSource={storeList} columns={columns} />
                    </Col>
                    <Col className="gutter-row" lg={{ span: 5, offset: 1 }}>
                        <h2 style={{ textAlign: 'center' }}>Store Balance</h2>
                        <Table dataSource={storeBalanceList} columns={columnsB} />
                    </Col>
                    <Col className="gutter-row" lg={{ span: 5, offset: 1 }}>
                        <h2 style={{ textAlign: 'center' }}>Store Inventory</h2>
                        <Table dataSource={storeIncentoryList} columns={columnsI} />
                    </Col>
                    <Col className="gutter-row" lg={{ span: 4, offset: 1 }}>
                        <Button type="primary" block onClick={onSignOut}>
                            SignOut
                        </Button>
                        <h2 style={{ textAlign: 'center', marginTop: '70px', fontSize: '14px' }}>Total Store Inventory:</h2>
                        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '24px' }}>
                            ${totalInventory.toFixed(2)}
                        </div>
                        <h2 style={{ textAlign: 'center', marginTop: '70px', fontSize: '14px' }}>Total Store Balance:</h2>
                        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '24px' }}>
                            ${totalBalance.toFixed(2)}
                        </div>
                        <h2 style={{ textAlign: 'center', marginTop: '70px', fontSize: '14px' }}>Site Manager Balance:</h2>
                        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '24px' }}>
                            ${managerBalance.toFixed(2)}
                        </div>
                    </Col>
                </Row>
            </div>
        </Spin>
    )
}

export default SiteManager
