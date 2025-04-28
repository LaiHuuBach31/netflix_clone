import { Button } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const HeaderRegister = () => {
    return (
        <header className="flex justify-between items-center px-6 py-4 bg-transparent border-b border-gray-700">
            <div className="text-4xl font-bold text-red-600">
                <Link to={'/'}>
                    <img
                        className="w-[100px]"
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1200px-Netflix_2015_logo.svg.png"
                        alt="Logo"
                    />
                </Link>
            </div>
            <Link to="/login">
                <Button className="bt-login font-medium" shape="round">
                    Đăng nhập
                </Button>
            </Link>
        </header>
    )
}

export default HeaderRegister