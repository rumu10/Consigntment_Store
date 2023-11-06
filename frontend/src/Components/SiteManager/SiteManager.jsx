import { Row, Col, Table, Button, Spin } from 'antd'
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { API_ENDPOINT } from '../../config';

const SiteManager = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [storeList, setStoreList] = useState([]);
    const [storeBalanceList, setStoreBalanceList] = useState([]);
    const [storeIncentoryList, setStoreInventoryList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [totalInventory, setTotalInventory] = useState(0);
    const [totalBalance, setTotalbalance] = useState(0);

    useEffect(() => {

        console.log(id);
        fetchStores();

    }, []);

    const fetchStores = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_ENDPOINT}stores?storeId=`);
            console.log(data);
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
                fetchTotal();
                setLoading(false);

            } else {
                console.log("eerrrr login site manager")
            }

        } catch (e) {
            console.log(e);
        }
    }

    const fetchTotal = async () => {
        try {
            const { data } = await axios.get(`${API_ENDPOINT}managers`);
            console.log(data);
            if (data) {
                setTotalInventory(data?.totals[0].total_inventory);
                setTotalbalance(data?.totals[0].total_balance);
                setLoading(false);

            } else {
                console.log("eerrrr login site manager")
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
            title: 'Inventory',
            dataIndex: 'inventory',
            key: 'age',
        },

    ];

    const columnsB = [
        {
            title: 'Store Name',
            dataIndex: 'storeName',
            key: 'name',
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'age',
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
    }

    const onSignOut = () => {
        navigate('/login')
    }
    return (
        <Spin spinning={loading}>
            <div className='site-manager' style={{ margin: '30px' }}>

                <Row>
                    <Col className="gutter-row" lg={{ span: 5, offset: 0 }}>
                        <h2 style={{ textAlign: 'center' }}>Store List</h2>
                        <Table dataSource={storeList} columns={columns} />;
                    </Col>
                    <Col className="gutter-row" lg={{ span: 5, offset: 1 }}>
                        <h2 style={{ textAlign: 'center' }}>Store Balance</h2>
                        <Table dataSource={storeBalanceList} columns={columnsB} />;
                    </Col>
                    <Col className="gutter-row" lg={{ span: 5, offset: 1 }}>
                        <h2 style={{ textAlign: 'center' }}>Store Inventory</h2>
                        <Table dataSource={storeIncentoryList} columns={columnsI} />;
                    </Col>
                    <Col className="gutter-row" lg={{ span: 4, offset: 1 }}>
                        <Button type="primary" block onClick={onSignOut}>
                            SignOut
                        </Button>
                        <h2 style={{ textAlign: 'center', marginTop: '70px', fontSize: '14px' }}>Total Inventory:</h2>
                        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '24px' }}>
                            {totalInventory.toFixed(2)}
                        </div>
                        <h2 style={{ textAlign: 'center', marginTop: '70px', fontSize: '14px' }}>Total Balance:</h2>
                        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '24px' }}>
                            {totalBalance.toFixed(2)}
                        </div>
                    </Col>
                </Row>
            </div>
        </Spin>
    )
}

export default SiteManager
