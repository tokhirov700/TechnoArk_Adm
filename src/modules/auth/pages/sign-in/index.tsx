import { Button, Form, Input } from 'antd';
import { NavLink } from 'react-router-dom';
import { SignInTypes } from '../../types';
import { useSignInMutation } from '../../hooks/mutations';
import logo from '../../../../assets/erp.png';

const SignIn = () => {
    const { mutate } = useSignInMutation();
    
    const onFinish = async (values: SignInTypes) => {
        mutate(values);  
    };

    const onFinishFailed = () => {
        console.log('Failed to sign in.');
    };

    return (
        <div className='flex'>
            <div>
                <img className='h-screen' src={logo} alt="ERP Logo" />
            </div>
            <div className='w-1/2'>
                <div className='h-screen flex flex-col justify-center px-48'>
                    <h1 className='flex justify-start mb-8 font-extrabold text-4xl'>Login</h1>
                    <Form
                        name="signInForm"
                        style={{ maxWidth: 1000 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Phone number"
                            name="phone_number"
                            rules={[{ required: true, message: 'Please input your phone number!' }]}
                        >
                            <Input style={{ borderColor: '#d55200' }} />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password style={{ borderColor: '#d55200' }} />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                className="w-full"
                                type="primary"
                                htmlType="submit"
                                style={{ backgroundColor: '#d55200', borderColor: '#d55200' }}
                            >
                                Submit
                            </Button>
                            <p className="mt-4">
                                Don't have an account?{' '}
                                <NavLink to="/sign-up" className="font-bold">Register</NavLink>
                            </p>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
