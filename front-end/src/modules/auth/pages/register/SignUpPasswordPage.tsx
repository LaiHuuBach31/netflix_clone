import { Button, Input } from 'antd';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import HeaderRegister from './HeaderRegister';

const SignUpPasswordPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <HeaderRegister />
            <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
                <h1 className="text-3xl font-bold mb-4">Add a password</h1>
                <Input.Password placeholder="Password" className="w-[300px] mb-4" />
                <Button
                    type="primary"
                    className="bg-red-600 w-[300px]"
                    onClick={() => navigate('/signup/plan')}
                >
                    Next
                </Button>
            </div>
        </>
    );
}

export default SignUpPasswordPage