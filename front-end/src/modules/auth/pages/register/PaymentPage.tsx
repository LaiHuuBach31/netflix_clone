import { Button, Form, Input } from 'antd';
import React from 'react';
import HeaderRegister from './HeaderRegister';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast } from '../../../../utils/toast';

const PaymentPage: React.FC = () => {
    const navigate = useNavigate();

    const handlePayment = () => {
        showSuccessToast('Successful Payment');
        navigate('/login');
    };

    return (
        <>
            <HeaderRegister />

            <div className="flex flex-col items-center justify-center h-screen bg-black text-white" style={{ backgroundColor: '#000' }}>
                <h1 className="text-3xl font-bold mb-10">Enter your payment details</h1>
                <Form
                    name="payment"
                    onFinish={handlePayment}
                    layout="vertical"
                    className="w-full max-w-md"
                >
                    <Form.Item
                        label={<span className="text-white">Card Number</span>}
                        name="cardNumber"
                        rules={[{ required: true, message: 'Please input card number!' }]}
                        className="mb-6"
                    >
                        <Input
                            className="w-full p-3 border border-gray-600 rounded text-black"
                            placeholder="Enter your card number"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-white">MM/YY</span>}
                        name="expiryDate"
                        rules={[{ required: true, message: 'Please input MM/YY!' }]}
                        className="mb-6"
                    >
                        <Input
                            className="w-full p-3 border border-gray-600 rounded text-black"
                            placeholder="Enter your MM/YY"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-white">CVC</span>}
                        name="cvc"
                        rules={[{ required: true, message: 'Please input CVC!' }]}
                        className="mb-6"
                    >
                        <Input
                            className="w-full p-3 border border-gray-600 rounded text-black"
                            placeholder="Enter your CVC"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            block
                            type="primary"
                            htmlType="submit"
                            size="large"
                            className="bg-red-600 hover:bg-red-700 border-none p-4 rounded text-white"
                        >
                            Start Membership
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default PaymentPage;