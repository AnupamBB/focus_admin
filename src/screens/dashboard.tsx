import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {DownOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined} from '@ant-design/icons';
import {Layout, Menu, theme, Typography, Grid, Button, Col, Row, MenuProps, message, Dropdown, Space} from 'antd';
import './styles.css';

const {Header, Content, Sider} = Layout;
const {Title} = Typography;
const {useToken} = theme;
const {useBreakpoint} = Grid;

const Dashboard = () => {
	const navigate = useNavigate();
	const [selectedMasterCategory, setSelectedMasterCategory] = useState('Select master category');
	const [examCategories, setExamCategories] = useState([]); // To store the corresponding exam categories
	const [selectedExamCategory, setSelectedExamCategory] = useState('Select exam category');

	const handleUploadQuestions = () => {
		navigate('/upload-exam-questions');
	};
	const handleUpdateAffairs = () => {
		navigate('/upload-current-affairs');
	};

	const {token} = useToken();
	const screens = useBreakpoint();
	const {
		token: {colorBgContainer, borderRadiusLG},
	} = theme.useToken();

	const styles = {
		title: {
			fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
		},
		gapBetweenDropdowns: {
			marginTop: '16px', // Adds 16px gap between the dropdowns
		}
	};

	// Mapping exam categories based on master category selection
	const examCategoryMap = {
		Engineering: [
			{label: 'Civil', key: '1'},
			{label: 'Mechanical', key: '2'},
			{label: 'Electrical', key: '3'},
		],
		Banking: [
			{label: 'PO', key: '1'},
			{label: 'Clerk', key: '2'},
		],
		Law: [
			{label: 'Corporate', key: '1'},
			{label: 'Criminal', key: '2'},
		],
		Management: [
			{label: 'HR', key: '1'},
			{label: 'Finance', key: '2'},
		],
		Medical: [
			{label: 'MBBS', key: '1'},
			{label: 'BDS', key: '2'},
		],
	};

	const handleMenuClick: MenuProps['onClick'] = (e) => {
		const selectedMaster = e.domEvent.currentTarget.innerText;
		setSelectedMasterCategory(selectedMaster); // Update selected category
		setExamCategories(examCategoryMap[selectedMaster]); // Set exam categories based on master category
		setSelectedExamCategory('Select exam category'); // Reset exam category after master category selection
		message.info(`Selected ${selectedMaster}`);
	};

	const handleExamMenuClick: MenuProps['onClick'] = (e) => {
		const selectedExam = e.domEvent.currentTarget.innerText;
		setSelectedExamCategory(selectedExam); // Update selected exam category
		message.info(`Selected ${selectedExam}`);
	};

	const masterCategoryItems: MenuProps['items'] = [
		{label: 'Engineering', key: '1', icon: <UserOutlined/>, onClick: handleMenuClick},
		{label: 'Banking', key: '2', icon: <UserOutlined/>, onClick: handleMenuClick},
		{label: 'Law', key: '3', icon: <UserOutlined/>, onClick: handleMenuClick},
		{label: 'Management', key: '4', icon: <UserOutlined/>, onClick: handleMenuClick},
		{label: 'Medical', key: '5', icon: <UserOutlined/>, onClick: handleMenuClick},
	];

	return (
		<Layout style={{minHeight: '100vh', minWidth: '100vw'}}>
			<Sider width={200} style={{background: '#f4f4f4', paddingTop:20,boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',}}>
				<Menu style={{background:'#f4f4f4'}} defaultSelectedKeys={['1']} mode="inline">
					<Menu.Item key="1">Overview</Menu.Item>
					<Menu.SubMenu key="sub1" title="Management">
						<Menu.Item key="2">Member</Menu.Item>
						<Menu.Item key="3">Product List</Menu.Item>
						<Menu.Item key="4">Partner List</Menu.Item>
					</Menu.SubMenu>
					<Menu.Item key="5">Analytics</Menu.Item>
					<Menu.Item key="6">Accounting</Menu.Item>
					<Menu.Item key="7">Reports</Menu.Item>
					<Menu.Item key="8">Settings</Menu.Item>
				</Menu>
			</Sider>
			<Layout>
				<Header style={{background: colorBgContainer,boxShadow: '0 8px 16px rgba(2, 2, 2, 0.1)'}}>
					<div style={{textAlign: 'center', color: 'black', fontSize: 32, fontWeight: 'bold'}}>BidYa Admin
						Portal
					</div>
				</Header>
				<Layout style={{padding: '24px 24px 24px'}}>
					<Content
						style={{
							padding: 24,
							margin: 0,
							minHeight: 280,
							background: colorBgContainer,
							borderRadius: borderRadiusLG,
						}}
					>
						<div
							style={{
								minHeight: '90vh',
								background: colorBgContainer,
								borderRadius: borderRadiusLG,
								padding: '16px',
							}}
						>
							<div>
								<Dropdown
									menu={{
										items: masterCategoryItems,
									}}
									trigger={['click']}
								>
									<a onClick={(e) => e.preventDefault()}>
										<Space>
											<Button>
												{selectedMasterCategory} {/* Display selected category here */}
												<DownOutlined/>
											</Button>
										</Space>
									</a>
								</Dropdown>
								<div style={styles.gapBetweenDropdowns}></div>
								<Dropdown
									menu={{
										items: examCategories.map((item) => ({...item, onClick: handleExamMenuClick})), // Populate items dynamically
									}}
									trigger={['click']}
									disabled={selectedMasterCategory === 'Select master category'} // Disable if no master category is selected
								>
									<a onClick={(e) => e.preventDefault()}>
										<Space>
											<Button disabled={selectedMasterCategory === 'Select master category'}>
												{selectedExamCategory} {/* Display selected exam category here */}
												<DownOutlined/>
											</Button>
										</Space>
									</a>
								</Dropdown>
								<Row style={{height: '90vh', justifyContent: 'space-evenly', paddingTop: 40}}>
									<Col style={{width: '100vw', borderRadius: 16}} span={11}>
										<div
											style={{
												background: '#d1d5db',
												height: '60vh',
												alignContent: 'center',
												borderRadius: 16,
											}}
										>
											<p style={{textAlign: 'center'}}>UPLOAD Q/A FILE FOR PREVIEW</p>
										</div>
										<div style={{marginTop: 16, display: 'flex', justifyContent: 'space-between'}}>
											<Button onClick={handleUploadQuestions}>EDIT BEFORE CONFIRMATION</Button>
											<Button>CONFIRM</Button>
										</div>
									</Col>
									<Col style={{width: '100vw', borderRadius: 16}} span={11}>
										<div
											style={{
												background: '#d1d5db',
												height: '60vh',
												alignContent: 'center',
												borderRadius: 16,
											}}
										>
											<p style={{textAlign: 'center'}}>UPLOAD Q/A FILE FOR PREVIEW</p>
										</div>
										<div style={{marginTop: 16, display: 'flex', justifyContent: 'space-between'}}>
											<Button onClick={handleUpdateAffairs}>EDIT BEFORE CONFIRMATION</Button>
											<Button>CONFIRM</Button>
										</div>
									</Col>
								</Row>
								<Button
									style={{
										alignSelf: 'center'
									}}
									onClick={() => {
										alert('Successfully submitted');
									}}
								>
									CONFIRM AND SUBMIT
								</Button>
							</div>
						</div>
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
};

export default Dashboard;
