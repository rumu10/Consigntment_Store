import { Row, Col, Table, Button } from 'antd'
import React from 'react'
import { useNavigate } from "react-router-dom";

const SiteManager = () => {

    const navigate = useNavigate();

    const dataSourceBalance = [
        {
            key: '1',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
        },
        {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
        },
    ];

    const columnsB = [
        {
            title: 'Store Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Balance',
            dataIndex: 'age',
            key: 'age',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.age - b.age,
        },

    ];

    const dataSourceInventory = [
        {
            key: '1',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
        },
        {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
        },
    ];

    const columnsI = [
        {
            title: 'Store Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Inventory',
            dataIndex: 'age',
            key: 'age',
        },

    ];

    const dataSource = [
        {
            key: '1',
            name: 'Store 1',

        },
        {
            key: '2',
            name: 'Store 2',

        },
    ];

    const columns = [
        {
            title: 'Store Name',
            dataIndex: 'name',
            key: 'name',
            width: '25%'
        },
        {
            title: '',
            width: '25%',
            dataIndex: '',
            key: 'x',
            render: () => <Button type="primary" danger >Remove Store</Button>,
        },

    ];

    const onSignOut = () => {
        navigate('/login')
    }
    return (
        <div className='site-manager' style={{ margin: '30px' }}>

            <Row>
                <Col className="gutter-row" lg={{ span: 5, offset: 0 }}>
                    <h2 style={{ textAlign: 'center' }}>Store List</h2>
                    <Table dataSource={dataSource} columns={columns} />;
                </Col>
                <Col className="gutter-row" lg={{ span: 5, offset: 1 }}>
                    <h2 style={{ textAlign: 'center' }}>Store Balance</h2>
                    <Table dataSource={dataSourceBalance} columns={columnsB} />;
                </Col>
                <Col className="gutter-row" lg={{ span: 5, offset: 1 }}>
                    <h2 style={{ textAlign: 'center' }}>Store Inventory</h2>
                    <Table dataSource={dataSourceInventory} columns={columnsI} />;
                </Col>
                <Col className="gutter-row" lg={{ span: 4, offset: 1 }}>
                    <Button type="primary" block onClick={onSignOut}>
                        SignOut
                    </Button>
                    <h2 style={{ textAlign: 'center', marginTop: '70px', fontSize: '14px' }}>Total Inventory:</h2>
                    <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '24px' }}>
                        50
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default SiteManager
