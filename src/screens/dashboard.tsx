import {useNavigate} from 'react-router-dom';
import {LogoutOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import './styles.css'

export default function Dashboard() {
	const navigate = useNavigate();

	const handleUpload = () => {
		// Navigate to the dashboard after "Login"
		navigate('/upload');
	};
	return (
		<div className="dashboard-container">
			<header className="dashboard-header">
				<h1 className="text-4xl font-bold">BidYa Admin Panel</h1>
				<Button type="primary" shape="circle" icon={<LogoutOutlined/>}/>
			</header>

			<main className="dashboard-main">
				<div className="section-container">
					<div className="grid-container">
						<div className="grid-box">
							<p className="text-center">UPLOAD Q/A FILE FOR PREVIEW</p>
						</div>

						<div className="grid-box">
							<p className="text-center">UPDATE CURRENT AFFAIRS</p>
						</div>
					</div>

					<div className="grid-container mt-8">
						<div className="flex flex-col items-center gap-4">
							<Button className="dashboard-button" size="large">
								EDIT BEFORE CONFIRMATION
							</Button>
							<Button className="dashboard-button" size="large">
								CONFIRM
							</Button>
						</div>

						<div className="flex flex-col items-center gap-4">
							<Button className="dashboard-button" size="large">
								EDIT BEFORE CONFIRMATION
							</Button>
							<Button className="dashboard-button" size="large">
								CONFIRM
							</Button>
						</div>
					</div>

					<div className="mt-10">
						<Button className="dashboard-button-large" size="large" onClick={handleUpload}>
							CONFIRM AND SUBMIT
						</Button>
					</div>
				</div>
			</main>

			<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
				{/* Footer content */}
			</footer>
		</div>
	);
}
