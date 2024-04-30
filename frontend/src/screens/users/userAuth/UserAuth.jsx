import { useState } from "react";
import { Card, Tabs, Row, Col } from "antd";

import SignInForm from "../signInForm/SignInForm";
import SignUpForm from "../signUpForm/SignUpForm";
import { GoogleOutlined } from "@ant-design/icons";
import { Button } from "antd";

import { googleAuth } from "../../../api/users/users.api";

const { TabPane } = Tabs;

const UserAuth = () => {
  const [operation, setOperation] = useState("signin");

  const handleTabChange = (key) => {
    setOperation(key);
  };

  const signInWithGoogle = () => {
    googleAuth();
  };

  return (
    <>
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Col xs={24} sm={24} md={12} lg={8} xl={10}>
          <Card
            style={{ width: "100%", background: "linear-gradient(to right, #88d8b0, #26a69a)" }}
          >
            <Tabs defaultActiveKey="signup" onChange={handleTabChange}>
              <TabPane tab="Sign In" key="signin"></TabPane>
              <TabPane tab="Sign Up" key="signup"></TabPane>
            </Tabs>

            {operation === "signin" ? <SignInForm /> : <SignUpForm />}

            <Button
              type="default"
              icon={<GoogleOutlined />}
              style={{
                display: "block",
                margin: "0 auto",
                width: "50%",
                backgroundColor: "#4285F4", // Google brand color
                color: "white", // Text color
              }}
              onClick={signInWithGoogle}
            >
              Continue with Google
            </Button>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default UserAuth;
