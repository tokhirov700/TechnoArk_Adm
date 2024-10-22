import { Button, Form, Input } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import { FormProps } from 'antd';
import { useSignUpMutation } from '../../hooks/mutations';
import logo from '../../../../assets/erp.png';

type FieldType = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
};

const SignUp = () => {
  const navigate = useNavigate();
  const { mutate } = useSignUpMutation();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values: FieldType) => {
    mutate(values, {
      onSuccess: (response: any) => {
        if (response.status === 201) {
          navigate('/');
        }
      },
    });
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = () => {
    console.log('Failed:');
  };

  return (
    <div className='flex'>
      <div>
        <img className='h-screen' src={logo} alt="ERP Logo" />
      </div>
      <div className='w-1/2'>
        <div className='h-screen flex flex-col justify-center px-48'>
          <h1 className='flex justify-start mb-8 font-extrabold text-4xl'>Sign Up</h1>
          <Form
            name="signUpForm"
            style={{ maxWidth: 1000 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="First name"
              name="first_name"
              rules={[{ required: true, message: 'Please input your first name!' }]}
            >
              <Input style={{ borderColor: '#d55200' }} />
            </Form.Item>
            <Form.Item
              label="Last name"
              name="last_name"
              rules={[{ required: true, message: 'Please input your last name!' }]}
            >
              <Input style={{ borderColor: '#d55200' }} />
            </Form.Item>
            <Form.Item
              label="Phone number"
              name="phone_number"
              rules={[{ required: true, message: 'Please input your phone number!' }]}
            >
              <Input style={{ borderColor: '#d55200' }} />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email address!' }]}
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
                className='w-full'
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: '#d55200', borderColor: '#d55200' }}
              >
                Submit
              </Button>
              <p className="mt-4">
                Already have an account?{' '}
                <NavLink to="/" className="font-bold">LogIn</NavLink>
              </p>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
