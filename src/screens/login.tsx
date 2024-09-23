import {useNavigate} from 'react-router-dom';
import {Input, Tooltip, Button} from 'antd';
import {InfoCircleOutlined, UserOutlined} from '@ant-design/icons';
import './styles.css'

export default function Login() {
	const navigate = useNavigate();

	const handleLogin = () => {
		// Navigate to the dashboard after "Login"
		navigate('/dashboard');
	};

	return (
		<div className="login-container">
			<h1 className="login-title">BidYa Admin Panel</h1>
			<p className="login-subtitle">Enter your credentials to login.</p>

			<div className="input-container">
				<Input
					placeholder="Enter your username"
					prefix={<UserOutlined style={{color: 'rgba(0,0,0,.25)'}}/>}
					suffix={
						<Tooltip title="Enter all in small caps">
							<InfoCircleOutlined style={{color: 'rgba(0,0,0,.45)'}}/>
						</Tooltip>
					}
					className="input-field"
				/>
				<Input
					placeholder="Enter your password"
					type="password"
					prefix={<UserOutlined style={{color: 'rgba(0,0,0,.25)'}}/>}
					suffix={
						<Tooltip title="Password should be at least 6 characters">
							<InfoCircleOutlined style={{color: 'rgba(0,0,0,.45)'}}/>
						</Tooltip>
					}
					className="input-field"
				/>
				<Button type="primary" block onClick={handleLogin}>
					Login
				</Button>
			</div>
		</div>
	);
}
