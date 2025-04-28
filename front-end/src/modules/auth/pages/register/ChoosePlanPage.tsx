import { Button, Card } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import HeaderRegister from './HeaderRegister';

const ChoosePlanPage = () => {

    const navigate = useNavigate();

    return (
        <>
            <HeaderRegister />
            <div className="p-6 bg-black text-white min-h-screen">
                <h1 className="text-3xl font-bold text-center mb-6">Choose your plan</h1>
                <div className="flex justify-center gap-4">
                    {['Basic', 'Standard', 'Premium'].map((plan) => (
                        <Card key={plan} title={plan} className="w-64 text-center">
                            <p>$9.99 / month</p>
                            <Button type="primary" className="bg-[red] p-4 text-[white] font-[500] border-none rounded-none hover:!text-[white] hover:!bg-[red] mt-2" onClick={() => navigate('/signup/payment')}>
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