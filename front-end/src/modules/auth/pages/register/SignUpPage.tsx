import { Button, Input } from 'antd';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import HeaderRegister from './HeaderRegister';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    return (
        <>
            <HeaderRegister />
            <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
                <h1 className="text-3xl font-bold mb-4 border-none">Create your account</h1>
                <Input
                    placeholder="Enter your email"
                    className="w-[300px] mb-4 p-5 border-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                    type="primary"
                    size="large"
                    className="bg-[red] p-6 text-[white] font-[500] border-none rounded-none hover:!text-[white] hover:!bg-[red]bg-[red] p-6 text-[white] font-[800] border-none rounded-none hover:!text-[white] hover:!bg-[red]bg-[red] p-6 text-[white] font-[800] border-none rounded-none hover:!text-[white] hover:!bg-[red]bg-[red] p-6 text-[white] font-[800] border-none rounded-none hover:!text-[white] hover:!bg-[red]bg-[red] p-6 text-[white] font-[800] border-none rounded-none hover:!text-[white] hover:!bg-[red]"
                    onClick={() => navigate('/signup/password')}
                >
                    Next
                </Button>
            </div>
        </>
    );
}

export default SignUpPage