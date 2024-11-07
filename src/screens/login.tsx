import { LockOutlined, MailOutlined } from "@ant-design/icons";
import {
    Layout,
    theme,
    Button,
    Form,
    Grid,
    Input,
    Typography,
    message,
} from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
const { Content } = Layout;
const { Text, Title } = Typography;
const { useToken } = theme;
const { useBreakpoint } = Grid;

const Login = () => {
    const { token } = useToken();
    const screens = useBreakpoint();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const response = await fetch(
                "https://examappbackend-0mts.onrender.com/api/v1/auth/user/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: values.email,
                        password: values.password,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Login failed!");
            }
            const result = await response.json();
            const data = result.data;

            if (data.accessToken) {
                localStorage.setItem("accessToken", data.accessToken);

                message.success("Login successful!");
                navigate("/live-test-questions");
            } else {
                message.error("Invalid login credentials!");
            }
        } catch (error) {
            console.error("Error:", error);
            message.error("Login failed. Please try again.");
        }
    };

    const styles = {
        container: {
            margin: "0 auto",
            padding: screens.md
                ? `${token.paddingXL}px`
                : `${token.sizeXXL}px ${token.padding}px`,
            width: screens.sm ? "32%" : "400px",
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
        header: {
            marginBottom: token.marginLG,
            textAlign: "center",
        },
        section: {
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            height: "100vh",
            padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
        },
        text: {
            color: token.colorTextSecondary,
        },
        title: {
            fontSize: screens.md
                ? token.fontSizeHeading2
                : token.fontSizeHeading3,
            color: token.colorPrimary,
        },
        form: {
            width: "100%",
            padding: "0 20px",
        },
        button: {
            backgroundColor: "#1890FF",
            borderRadius: "5px",
            color: "#fff",
            fontWeight: "bold",
            height: "45px",
        },
    };

    return (
        <Layout style={{ minHeight: "100vh", minWidth: "100vw" }}>
            <Layout>
                <Content>
                    <div
                        style={{
                            minHeight: "90vh",
                        }}
                    >
                        <section style={styles.section}>
                            <div style={styles.container}>
                                <div style={styles.header}>
                                    <img
                                        src={logo}
                                        alt="Login Logo"
                                        style={{
                                            width: "100px",
                                            // height: "100px",
                                        }}
                                    />
                                    <Title style={styles.title}>
                                        Focus Admin Portal
                                    </Title>
                                    <Text style={styles.text}>
                                        Enter your credentials to access your
                                        account.
                                    </Text>
                                </div>
                                <Form
                                    name="normal_login"
                                    initialValues={{ remember: true }}
                                    onFinish={onFinish}
                                    layout="vertical"
                                    requiredMark="optional"
                                    style={styles.form}
                                >
                                    <Form.Item
                                        name="email"
                                        rules={[
                                            {
                                                type: "email",
                                                required: true,
                                                message:
                                                    "Please input your Email!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            prefix={<MailOutlined />}
                                            placeholder="Email"
                                            style={{ height: "40px" }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your Password!",
                                            },
                                        ]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined />}
                                            placeholder="Password"
                                            style={{ height: "40px" }}
                                        />
                                    </Form.Item>
                                    <Form.Item style={{ marginBottom: "0px" }}>
                                        <Button
                                            block
                                            type="primary"
                                            htmlType="submit"
                                            style={styles.button}
                                        >
                                            Log in
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </section>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Login;
