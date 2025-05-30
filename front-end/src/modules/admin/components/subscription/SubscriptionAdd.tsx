import { useForm } from 'antd/es/form/Form';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { Button, Form, Input, Modal, Radio, Select, Spin } from 'antd';
import { fetchUsers } from '../../store/userSlice';
import { createPlan, fetchPlans } from '../../store/planSlice';
import { User } from '../../services/userService';
import { Plan } from '../../services/planService';
import VirtualList from 'rc-virtual-list';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import { createSubscription, fetchSubscriptions } from '../../store/subscriptionSlice';

interface SubscriptionAddProps {
    isModalOpen: boolean;
    onClose: () => void;
}

type FieldType = {
    user_id: number;
    plan_id: number;
    start_date: string;
    end_date: string;
    status: boolean;
};

const SubscriptionAdd: React.FC<SubscriptionAddProps> = ({ isModalOpen, onClose }) => {
    const [form] = useForm<FieldType>();
    const dispatch = useDispatch<AppDispatch>();
    const { response: userResponse, loading: userLoading } = useSelector((state: RootState) => state.user);
    const { response: planResponse, loading: planLoading } = useSelector((state: RootState) => state.plan);
    const [userOption, setUserOption] = useState<{ value: number; label: string }[]>([]);
    const [planOption, setPlanOption] = useState<{ value: number; label: string }[]>([]);
    const [currentPageUser, setCurrentPageUser] = useState<number>(1);
    const [hasMoreUser, setHasMoreUser] = useState<boolean>(true);
    const [lastPageUser, setLastPageUser] = useState<number | null>(null);
    const [currentPagePlan, setCurrentPagePlan] = useState<number>(1);
    const [hasMorePlan, setHasMorePlan] = useState<boolean>(true);
    const [lastPagePlan, setLastPagePlan] = useState<number | null>(null);
    const [searchKeywordUser, setSearchKeywordUser] = useState('');
    const [searchKeywordPlan, setSearchKeywordPlan] = useState('');
    const userSelectRef = useRef<any>(null);
    const planSelectRef = useRef<any>(null);
    const listRef = useRef<any>(null);

    useEffect(() => {
        if (isModalOpen) {
            setUserOption([]);
            setPlanOption([]);
            setCurrentPageUser(1);
            setHasMoreUser(true);
            setLastPageUser(null);
            setCurrentPagePlan(1);
            setHasMorePlan(true);
            setLastPagePlan(null);
            setSearchKeywordUser('');
            setSearchKeywordPlan('');
            form.resetFields();
            dispatch(fetchUsers({ page: 1, keyword: '' }));
            dispatch(fetchPlans({ page: 1, keyword: '' }));
        }
    }, [isModalOpen, dispatch]);

    useEffect(() => {
        if (userResponse && !userLoading) {
            setLastPageUser(userResponse.last_page);
            const newUserOptions = userResponse.data.map((user: User) => ({
                value: user.id,
                label: user.name,
            }));

            setUserOption((prev) => {
                const existingIds = new Set(prev.map((opt) => opt.value));
                const filterUserOptions = newUserOptions.filter((opt) => !existingIds.has(opt.value));
                return [...prev, ...filterUserOptions];
            });

            setHasMoreUser(userResponse.current_page < userResponse.last_page);
        }
    }, [userResponse, userLoading]);

    useEffect(() => {
        if (planResponse && !planLoading) {
            setLastPagePlan(planResponse.last_page);
            const newPlanOptions = planResponse.data.map((plan: Plan) => ({
                value: plan.id,
                label: plan.name,
            }));

            setPlanOption((prev) => {
                const existingIds = new Set(prev.map((opt) => opt.value));
                const filterPlanOptions = newPlanOptions.filter((opt) => !existingIds.has(opt.value));
                return [...prev, ...filterPlanOptions];
            });

            setHasMorePlan(planResponse.current_page < planResponse.last_page);
        }
    }, [planResponse, planLoading]);

    const loadMoreUser = useCallback(() => {
        if (userLoading || !hasMoreUser) return;
        if (lastPageUser && currentPageUser > lastPageUser) {
            setHasMoreUser(false);
            return;
        }
        const nextPage = currentPageUser + 1;
        setCurrentPageUser(nextPage);
        dispatch(fetchUsers({ page: nextPage, keyword: searchKeywordUser }));
    }, [userLoading, hasMoreUser, currentPageUser, lastPageUser, searchKeywordUser, dispatch]);

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

    const handleUserPopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 5 && hasMoreUser && !userLoading) {
            loadMoreUser();
        }
    };

    const handlePlanPopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 5 && hasMorePlan && !planLoading) {
            loadMorePlan();
        }
    };

    const handleSelectUser = (value: number) => {
        form.setFieldsValue({ user_id: value });
        if (userSelectRef.current) userSelectRef.current.blur();
    };

    const handleSelectPlan = (value: number) => {
        form.setFieldsValue({ plan_id: value });
        if (planSelectRef.current) planSelectRef.current.blur();
    };

    const renderItem = (item: { value: number; label: string }) => (
        <div key={item.value} style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => handleSelectUser(item.value)}>
            {item.label}
        </div>
    );

    const renderPlanItem = (item: { value: number; label: string }) => (
        <div key={item.value} style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => handleSelectPlan(item.value)}>
            {item.label}
        </div>
    );

    const handleSearchUser = (value: string) => {
        setSearchKeywordUser(value);
        setCurrentPageUser(1);
        setUserOption([]);
        setHasMoreUser(true);
        dispatch(fetchUsers({ page: 1, keyword: value }));
    };

    const handleSearchPlan = (value: string) => {
        setSearchKeywordPlan(value);
        setCurrentPagePlan(1);
        setPlanOption([]);
        setHasMorePlan(true);
        dispatch(fetchPlans({ page: 1, keyword: value }));
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        form.setFieldsValue({ start_date: e.target.value });
        updateEndDate();
    };

    const updateEndDate = () => {
        const startDateValue = form.getFieldValue('start_date');
        const planId = form.getFieldValue('plan_id');
        if (startDateValue && planId) {
            const selectedPlan = planResponse?.data.find((plan: Plan) => plan.id === planId);
            if (selectedPlan) {
                const startDate = new Date(startDateValue);
                const endDate = new Date(startDate);
                const durationMonths = Math.floor(selectedPlan.duration_days / 30);
                endDate.setMonth(startDate.getMonth() + durationMonths);
                if (endDate.getDate() !== startDate.getDate()) {
                    endDate.setDate(0);
                }
                form.setFieldsValue({
                    end_date: endDate.toISOString().split('T')[0],
                });
            }
        }
    };

    const onFinish = async (values: FieldType) => {
        const currentDate = new Date();
        const startDate = new Date(values.start_date);
        const endDate = new Date(values.end_date);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            form.setFields([
                { name: 'start_date', errors: ['Invalid start date'] },
                { name: 'end_date', errors: ['Invalid end date'] },
            ]);
            return;
        }

        if (startDate < currentDate) {
            form.setFields([{ name: 'start_date', errors: ['Start date cannot be in the past'] }]);
            return;
        }

        if (endDate <= startDate) {
            form.setFields([{ name: 'end_date', errors: ['End date must be after start date'] }]);
            return;
        }

        const selectedPlan = planResponse?.data.find((plan: Plan) => plan.id === values.plan_id);
        if (selectedPlan) {
            const durationDays = selectedPlan.duration_days || 0;
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays !== durationDays) {
                form.setFields([
                    {
                        name: 'end_date',
                        errors: [`The duration must match the ${durationDays} days according to the selected plan`],
                    },
                ]);
                return;
            }
        }

        try {
            await dispatch(createSubscription(values)).unwrap();
            showSuccessToast('Subscription created successfully!');
            form.resetFields();
            dispatch(fetchSubscriptions({ page: 1, keyword: '' }));
            setUserOption([]);
            setPlanOption([]);
            onClose();
        } catch (error: any) {
            showErrorToast(error.message || 'Failed to create');
            form.resetFields();
        }

        onClose();
    };

    const handleOk = () => form.submit();

    return (
        <Modal
            title="Add New Subscription"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={onClose}
            closable
            okText="Create"
            cancelText="Cancel"
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="create" type="primary" onClick={handleOk}>
                    Create
                </Button>,
            ]}
        >
            <Form
                form={form}
                name="add_subscription"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ status: true }}
                autoComplete="off"
                onFinish={onFinish}
            >
                <Form.Item<FieldType> label="User" name="user_id" rules={[{ required: true, message: 'Please select user!' }]}>
                    <Select
                        ref={userSelectRef}
                        showSearch
                        className="[&_.ant-select-selector]:p-2"
                        style={{ width: '100%' }}
                        placeholder="Select user"
                        allowClear
                        onSearch={handleSearchUser}
                        filterOption={false}
                        suffixIcon={userLoading ? <Spin size="small" /> : null}
                        dropdownRender={() => (
                            <VirtualList
                                ref={listRef}
                                data={userOption}
                                height={200}
                                itemHeight={32}
                                itemKey="value"
                                onScroll={handleUserPopupScroll}
                            >
                                {renderItem}
                            </VirtualList>
                        )}
                        onChange={(value) => form.setFieldsValue({ user_id: value })}
                    >
                        {userOption.map((item) => (
                            <Select.Option key={item.value} value={item.value}>
                                {item.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item<FieldType> label="Plan" name="plan_id" rules={[{ required: true, message: 'Please select plan!' }]}>
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

                <Form.Item<FieldType> label="Start Date" name="start_date" rules={[{ required: true, message: 'Please input start date' }]}>
                    <Input className="p-2" type="date" onChange={handleStartDateChange} />
                </Form.Item>

                <Form.Item<FieldType> label="End Date" name="end_date" rules={[{ required: true, message: 'Please input end date' }]}>
                    <Input className="p-2" type="date" />
                </Form.Item>

                <Form.Item<FieldType> label="Status" name="status">
                    <Radio.Group>
                        <Radio value={true}>Active</Radio>
                        <Radio value={false}>Inactive</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SubscriptionAdd;