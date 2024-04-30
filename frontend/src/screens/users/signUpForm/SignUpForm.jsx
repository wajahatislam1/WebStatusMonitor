import React from "react";
import { Button, Form, Input, message } from "antd";

import * as userApi from "../../../api/users/users.api";

const SignUpForm = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const response = await userApi.userSignup({
      email: values.email,
      password: values.password,
    });

    const responseJson = await response.json();
    if (response.ok) {
      message.success(responseJson.message);
    } else {
      message.error(responseJson.message);
    }

    form.resetFields(); // Clear form fields after successful submission
  };

  const validateConfirmPassword = (_, value) => {
    const passwordFieldValue = form.getFieldValue("password");
    if (value && value !== passwordFieldValue) {
      return Promise.reject("Passwords do not match");
    }
    return Promise.resolve();
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

      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
        required
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
          {
            validator: validateConfirmPassword,
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
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignUpForm;
