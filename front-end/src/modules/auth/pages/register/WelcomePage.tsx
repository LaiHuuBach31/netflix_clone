import { Button } from 'antd';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import HeaderRegister from './HeaderRegister';

const WelcomePage = () => {
    const navigate = useNavigate();
    return (
        <>
            <HeaderRegister />
            <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
                <h1 className="text-4xl font-bold mb-4">Unlimited movies, TV shows, and more</h1>
                <p className="mb-6">Watch anywhere. Cancel anytime.</p>
                <Button type="primary" size="large" onClick={() => navigate('/signup')} className="bg-[red] p-6 text-[white] font-[500] border-none rounded-none hover:!text-[white] hover:!bg-[red]">
                    Get Started
                </Button>
            </div>
        </>
    );
}

export default WelcomePage