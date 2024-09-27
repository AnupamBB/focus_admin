import {LockOutlined, MailOutlined} from '@ant-design/icons';
import {Layout, theme, Button, Form, Grid, Input, Typography} from 'antd';
import {useNavigate} from 'react-router-dom';

const {Content} = Layout;
const {Text, Title} = Typography;
const {useToken} = theme;
const {useBreakpoint} = Grid;

const Login = () => {
	const {token} = useToken();
	const screens = useBreakpoint();

	const onFinish = (values) => {
		console.log("Received values of form: ", values);
	};

	const navigate = useNavigate();

	const handleLogin = () => {
		// Navigate to the dashboard after "Login"
		navigate('/live-test-questions');
	};

	const styles = {
		container: {
			margin: "0 auto",
			padding: screens.md ? `${token.paddingXL}px` : `${token.sizeXXL}px ${token.padding}px`,
			width: "380px",
		},
		header: {
			marginBottom: token.marginXL,
		},
		section: {
			alignItems: "center",
			backgroundColor: token.colorBgContainer,
			display: "flex",
			height: screens.sm ? "100vh" : "auto",
			padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
		},
		text: {
			color: token.colorTextSecondary,
		},
		title: {
			fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
		},
	};

	return (
		<Layout style={{minHeight: '100vh', minWidth: '100vw'}}>
			<Layout>
				<Content>
					<div
						style={{
							minHeight: '90vh',
							background: token.colorBgContainer,
							borderRadius: token.borderRadiusLG,
						}}
					>
						<section style={styles.section}>
							<div style={styles.container}>
								<div style={styles.header}>
									<svg
										width="25"
										height="24"
										viewBox="0 0 25 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<rect x="0.464294" width="24" height="24" rx="4.8" fill="#1890FF"/>
										<path
											d="M14.8643 3.6001H20.8643V9.6001H14.8643V3.6001Z"
											fill="white"
										/>
										<path
											d="M10.0643 9.6001H14.8643V14.4001H10.0643V9.6001Z"
											fill="white"
										/>
										<path
											d="M4.06427 13.2001H11.2643V20.4001H4.06427V13.2001Z"
											fill="white"
										/>
									</svg>

									<Title style={styles.title}>BidYa Admin Portal</Title>
									<Text style={styles.text}>
										Enter your credentials to access your account.
									</Text>
								</div>
								<Form
									name="normal_login"
									initialValues={{remember: true}}
									onFinish={onFinish}
									layout="vertical"
									requiredMark="optional"
								>
									<Form.Item
										name="email"
										rules={[
											{type: "email", required: true, message: "Please input your Email!"},
										]}
									>
										<Input prefix={<MailOutlined/>} placeholder="Email"/>
									</Form.Item>
									<Form.Item
										name="password"
										rules={[
											{required: true, message: "Please input your Password!"},
										]}
									>
										<Input.Password prefix={<LockOutlined/>} placeholder="Password"/>
									</Form.Item>
									<Form.Item style={{marginBottom: "0px"}}>
										<Button block type="primary" htmlType="submit" onClick={handleLogin}>
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
