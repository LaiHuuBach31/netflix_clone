import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Flex, Form, Input } from 'antd'
import React, { useState } from 'react'
import './loginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth, loginAsync } from '../../../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../../../store';

const LoginPage: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await dispatch(loginAsync({ email, password })).unwrap();

      const roles = result.user?.roles || [];
      if (roles.includes('Admin')) {
        navigate("/admin");
      } else {
        navigate("/");
      }
      await dispatch(checkAuth());
      showSuccessToast("Login successful");
    } catch (error: any) {
      const errorDetails = error.errors ? Object.values(error.errors).flat() : [];
      const detailedError = errorDetails.length
        ? errorDetails[0]
        : error.message || "Login failed";
      showErrorToast(detailedError);
    }
  };


  return (
    <>
      <div
        className="w-full h-screen bg-cover bg-center flex items-center justify-center relative"
        style={{
          backgroundImage: `url('https://assets.nflxext.com/ffe/siteui/vlv3/fa4630b1-ca1e-4788-94a9-eccef9f7af86/web/VN-en-20250407-TRIFECTA-perspective_feab6af9-29a3-42d0-b914-b860d5222c91_large.jpg')`,
        }}
      >
        <Link to="/">
          <div className='absolute top-[10%] left-[10%] cursor-pointer z-10'>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1200px-Netflix_2015_logo.svg.png" width={100} alt="" />
          </div>
        </Link>
        <div className="bg-black bg-opacity-60 p-10 rounded-md max-w-sm w-full text-white">
          <h1 className="text-2xl font-semibold mb-6">Sign In</h1>

          <Form
            name="login"
            onFinish={handleLogin}
            initialValues={{ remember: true }}
            layout="vertical"
          >
            <Form.Item
              name="email"

              rules={[
                { required: true, message: 'Please input your Email!' },
                { type: 'email', message: 'Please enter a valid Email address!' },
              ]}
            >
              <Input
                onChange={(e) => setEmail(e.target.value)}
                prefix={<UserOutlined />}
                placeholder="Email"
                className="bg-[#333] border-none text-black placeholder-gray-400 p-4"
                size="large"
              />

            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input.Password
                onChange={(e) => setPassword(e.target.value)}
                prefix={<LockOutlined />}
                placeholder="Password"
                className="bg-[#333] border-none text-black placeholder-gray-400 p-4"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                size="large"
                className="bg-red-600 hover:bg-red-700 border-none p-4 login"
              >
                Sign In
              </Button>
            </Form.Item>

            <Flex justify="space-between" className="text-sm text-gray-300 mb-4">
              <Form.Item name="" className='remember' valuePropName="" noStyle>
                <Checkbox className="text-white remember">Remember me</Checkbox>
              </Form.Item>
              <a href="#" className="text-white">Need help?</a>
            </Flex>

            <div className="text-sm text-gray-400">
              New to Design Flix? <Link className="text-white" to="/welcome">Sign up now.</Link>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This page is protected by Google reCAPTCHA to ensure you’re not a bot.
            </p>
          </Form>
        </div>
      </div>
    </>
  )
}

export default LoginPage
