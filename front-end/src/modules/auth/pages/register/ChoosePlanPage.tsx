import { Button, Card } from 'antd'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import HeaderRegister from './HeaderRegister';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { fetchPlans } from '../../../admin/store/planSlice';
import { createSubscription } from '../../../admin/store/subscriptionSlice';
import { now } from 'lodash';
import { Plan } from '../../../admin/services/planService';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import dayjs from 'dayjs';

const ChoosePlanPage:React.FC = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { response: planResponse, loading: planLoading } = useSelector((state: RootState) => state.plan);

    useEffect(() => {
        dispatch(fetchPlans({}));
    }, [dispatch]);


    const handleCreatePlan = (plan: Plan) => {
        let user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            const startDate = dayjs();
            const endDate = startDate.add(plan.duration_days, 'day').format('YYYY-MM-DD');

            const data = {
                user_id: parsedUser.id,
                plan_id: plan.id,
                start_date: startDate.format('YYYY-MM-DD'),
                end_date: endDate,
                status: true,
            };
            dispatch(createSubscription(data)).unwrap()
                .then((response) => {
                    showSuccessToast(response.message || 'Success');
                    navigate('/signup/payment')
                })
                .catch((error: any) => {
                    const errorDetails = error.errors ? Object.values(error.errors).flat() : [];
                    const detailedError = errorDetails.length
                        ? errorDetails[0]
                        : error.message || "Failed to create genre";
                    showErrorToast(detailedError);
                })
        }
    }

    return (
        <>
            <HeaderRegister />

            <div className="p-6 bg-black text-white min-h-screen">
                <h1 className="text-3xl font-bold text-center mb-6">Choose your plan</h1>
                <div className="flex justify-center gap-4">
                    {planResponse?.data.map((plan) => (
                        <Card key={plan.id} title={plan.name} className="w-64 text-center">
                            <p>{plan.price} VND</p>
                            <Button type="primary" className="bg-[red] p-4 text-[white] font-[500] border-none rounded-none hover:!text-[white] hover:!bg-[red] mt-2" onClick={() => handleCreatePlan(plan)}>
                                Select
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    )
}

export default ChoosePlanPage