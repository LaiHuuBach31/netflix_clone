import React, { useCallback, useEffect, useRef, useState } from 'react';
import HeaderRegister from '../register/HeaderRegister';
import { useNavigate } from 'react-router-dom';
import { showErrorToast, showSuccessToast, showWarningToast } from '../../../../utils/toast';
import { Button, Form, Input, Select, Spin } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { fetchPlans } from '../../../admin/store/planSlice';
import VirtualList from 'rc-virtual-list';
import { useForm } from 'antd/es/form/Form';
import './subscriptionExtension.css';
import { Plan } from '../../../admin/services/planService';
import { createSubscription, fetchSubscriptions } from '../../../admin/store/subscriptionSlice';
import { fetchUserByEmail } from '../../../admin/store/userSlice';
import { CreatePayload } from '../../../admin/services/subscriptionService';

type FieldType = {
    email: string;
    plan_id: number;
    cardNumber: string;
    cvc: string;
};

const SubscriptionExtension = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [form] = useForm<FieldType>();
    const { response: planResponse, loading: planLoading } = useSelector((state: RootState) => state.plan);
    const [searchKeywordPlan, setSearchKeywordPlan] = useState('');
    const [currentPagePlan, setCurrentPagePlan] = useState<number>(1);
    const [planOption, setPlanOption] = useState<{ value: number; label: string }[]>([]);
    const [hasMorePlan, setHasMorePlan] = useState<boolean>(true);
    const [lastPagePlan, setLastPagePlan] = useState<number | null>(null);

    const planSelectRef = useRef<any>(null);
    const listRef = useRef<any>(null);

    useEffect(() => {
        setPlanOption([]);
        setCurrentPagePlan(1);
        setHasMorePlan(true);
        setLastPagePlan(null);
        setSearchKeywordPlan('');
        dispatch(fetchPlans({ page: 1, keyword: '' }));
    }, [dispatch]);

    useEffect(() => {
        if (planResponse && planResponse.data) {
            const newPlans = planResponse.data.map((plan: Plan) => ({
                value: plan.id,
                label: plan.name,
            }));
            setPlanOption((prev) => {
                const uniquePlans = newPlans.filter(
                    (newPlan) => !prev.some((p) => p.value === newPlan.value)
                );
                return [...prev, ...uniquePlans];
            });
            setLastPagePlan(planResponse.last_page || null);
        } else {
            console.log('No plan data received:', planResponse);
        }
    }, [planResponse]);

    const handleSearchPlan = (value: string) => {
        setSearchKeywordPlan(value);
        setCurrentPagePlan(1);
        setPlanOption([]);
        setHasMorePlan(true);
        dispatch(fetchPlans({ page: 1, keyword: value }));
    };

    const handlePlanPopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 5 && hasMorePlan && !planLoading) {
            loadMorePlan();
        }
    };

    const loadMorePlan = useCallback(() => {
        if (planLoading || !hasMorePlan) return;
        if (lastPagePlan && currentPagePlan > lastPagePlan) {
            setHasMorePlan(false);
            return;
        }
        const nextPage = currentPagePlan + 1;
        setCurrentPagePlan(nextPage);
        dispatch(fetchPlans({ page: nextPage, keyword: searchKeywordPlan }));
    }, [planLoading, hasMorePlan, currentPagePlan, lastPagePlan, searchKeywordPlan, dispatch]);

    const renderPlanItem = (item: { value: number; label: string }) => (
        <div
            key={item.value}
            style={{ padding: '8px 16px', cursor: 'pointer', color: '#fff', backgroundColor: '#1a1a1a' }}
            onClick={() => handleSelectPlan(item.value)}
        >
            {item.label}
        </div>
    );

    const handleSelectPlan = (value: number) => {
        form.setFieldsValue({ plan_id: value });
        if (planSelectRef.current) planSelectRef.current.blur();
    };

    const handleExtend = async (values: FieldType) => {
        const currentDate = new Date();
        const startDate = currentDate.toISOString().split('T')[0]; 
        const selectedPlan = planResponse?.data.find((plan: Plan) => plan.id === values.plan_id);

        if (!selectedPlan) {
            form.setFields([{ name: 'plan_id', errors: ['Please select a valid plan'] }]);
            return;
        }

        const durationDays = selectedPlan.duration_days || 0;
        const endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() + durationDays);
        const formattedEndDate = endDate.toISOString().split('T')[0];

        try {
            const user = await dispatch(fetchUserByEmail(values.email)).unwrap();

            if (!user || !user.id) {
                throw new Error('User not found or invalid user data');
            }

            const payload: CreatePayload = {
                user_id: user.id,
                plan_id: values.plan_id,
                start_date: startDate,
                end_date: formattedEndDate,
                status: true,
            };

            try {
                const res = await dispatch(createSubscription(payload)).unwrap();
                showSuccessToast('Subscription extended successfully!');
                form.resetFields();
                dispatch(fetchSubscriptions({ page: 1, keyword: '' }));
                setPlanOption([]);
                navigate('/login');
            } catch (error: any) {
                const errorDetails = error.errors ? Object.values(error.errors).flat() : [];
                const detailedError = errorDetails.length
                    ? errorDetails[0]
                    : error.message || 'Failed to create subscription';
                showErrorToast(detailedError);
                form.resetFields();
            }
        } catch (error: any) {
            // const errorDetails = error.errors ? Object.values(error.errors).flat() : [];
            // const detailedError = errorDetails.length
            //     ? errorDetails[0]
            //     : error.message || 'User not found with the provided email';
            // showErrorToast(detailedError);
            form.resetFields();
            navigate('/welcome');
            showWarningToast('Sign up to continue with netflex');
        }
    };

    return (
        <>
            <HeaderRegister />
            <div className="flex flex-col items-center justify-center h-screen bg-black text-white" style={{ backgroundColor: '#000' }}>
                <h1 className="text-3xl font-bold mb-10">Subscription Extension</h1>
                <Form
                    form={form}
                    name="payment"
                    onFinish={handleExtend}
                    layout="vertical"
                    className="w-full max-w-md"
                >
                    <Form.Item<FieldType>
                        label={<span className="text-white">Email</span>}
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your Email!' },
                            { type: 'email', message: 'Please enter a valid Email address!' },
                        ]}
                        className="mb-6"
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-500" />}
                            placeholder="Enter your email"
                            className="w-full p-3 border border-gray-600 rounded text-black"
                        />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label={<span className="text-white">Plan</span>}
                        name="plan_id"
                        rules={[{ required: true, message: 'Please select plan!' }]}
                    >
                        <Select
                            ref={planSelectRef}
                            showSearch
                            className="[&_.ant-select-selector]:p-2"
                            style={{ width: '100%' }}
                            placeholder="Select plan"
                            allowClear
                            onSearch={handleSearchPlan}
                            filterOption={false}
                            suffixIcon={planLoading ? <Spin size="small" /> : null}
                            dropdownRender={() => (
                                <VirtualList
                                    ref={listRef}
                                    data={planOption}
                                    height={200}
                                    itemHeight={32}
                                    itemKey="value"
                                    onScroll={handlePlanPopupScroll}
                                >
                                    {renderPlanItem}
                                </VirtualList>
                            )}
                            onChange={(value) => form.setFieldsValue({ plan_id: value })}
                        >
                            {planOption.map((item) => (
                                <Select.Option key={item.value} value={item.value}>
                                    {item.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item<FieldType>
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

                    <Form.Item<FieldType>
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
                            className="bg-red-600 hover:bg-red-700 border-none p-4 rounded text-white mt-3"
                        >
                            Extend
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default SubscriptionExtension;