import { Button, Input } from 'antd'
import React from 'react'
import HeaderRegister from './HeaderRegister'

const PaymentPage = () => {
    return (
        <>
            <HeaderRegister />
            <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
                <h1 className="text-3xl font-bold mb-4">Enter your payment details</h1>
                <Input placeholder="Card Number" className="w-[300px] mb-4 p-4" />
                <Input placeholder="MM/YY" className="w-[300px] mb-4 p-4" />
                <Input placeholder="CVC" className="w-[300px] mb-4 p-4" />
                <Button type="primary" className="bg-[red] p-6 text-[white] font-[500] border-none rounded-none hover:!text-[white] hover:!bg-[red] w-[300px]">
                    Start Membership
                </Button>
            </div>
        </>
    )
}

export default PaymentPage