import React from "react";
import { Button, Form, Input } from "antd";

import { userSignIn } from "../../../redux/slices/user.slice";
import { useDispatch } from "react-redux";

const SignInForm = () => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const onFinish = async (values) => {
    dispatch(
      userSignIn({
        email: values.email,
        password: values.password,
      })
    );

    form.resetFields(); // Clear form fields after successful submission
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        label="Email"
        name="email"
        required
        rules={[
          {
            type: "email",
            message: "The input is not a valid E-mail!",
          },
          {
            required: true,
            message: "Please input your E-mail!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        required
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ display: "block", margin: "0 auto", width: "50%" }}
        >
          Sign In
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignInForm;
