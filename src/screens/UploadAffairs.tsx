import React from 'react';
import {UploadOutlined, UserOutlined, VideoCameraOutlined, CalendarOutlined, DownOutlined} from '@ant-design/icons';
import {
	Layout,
	Menu,
	theme,
	Typography,
	Grid,
	DatePicker,
	Input,
	Button,
	Upload,
	Dropdown,
	message,
	Space,
	Tooltip, Col, Row
} from 'antd';
import './styles.css';
import type {MenuProps} from 'antd';

const {Header, Content, Footer, Sider} = Layout;
const items = [UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
	(icon, index) => ({
		key: String(index + 1),
		icon: React.createElement(icon),
		label: `nav ${index + 1}`,
	})
);
const {Title} = Typography;
const {useToken} = theme;
const {useBreakpoint} = Grid;

const handleMenuClick: MenuProps['onClick'] = (e) => {
	message.info('Clicked on menu item.');
	console.log('click', e);
};

const menuItems: MenuProps['items'] = [
	{
		label: 'World',
		key: '1',
		icon: <UserOutlined/>,
		onClick: handleMenuClick,
	},
	{
		label: 'India',
		key: '2',
		icon: <UserOutlined/>,
		onClick: handleMenuClick,
	},
	{
		label: 'Assam',
		key: '3',
		icon: <UserOutlined/>,
		onClick: handleMenuClick,
	},
	{
		label: 'Economics',
		key: '4',
		icon: <UserOutlined/>,
		onClick: handleMenuClick,
	},
];

const UploadAffairs = () => {
	const {token} = useToken();
	const screens = useBreakpoint();
	const {
		token: {colorBgContainer, borderRadiusLG},
	} = theme.useToken();

	const styles = {
		title: {
			fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
		},
	};

	return (
		<Layout style={{minHeight: '100vh', minWidth: '100vw'}}>
			<Sider
				breakpoint="lg"
				collapsedWidth="0"
				onBreakpoint={(broken) => {
					console.log(broken);
				}}
				onCollapse={(collapsed, type) => {
					console.log(collapsed, type);
				}}
			>
				<div className="demo-logo-vertical"/>
				<Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} items={items}/>
			</Sider>
			<Layout>
				<Header
					style={{
						padding: 0,
						background: colorBgContainer,
						textAlign: 'center',
					}}
				>
					<Title style={styles.title}>BidYa Admin Portal</Title>
				</Header>
				<Content
					style={{
						margin: '24px 16px 0',
					}}
				>
					<div
						style={{
							padding: 24,
							minHeight: '90vh',
							background: colorBgContainer,
							borderRadius: borderRadiusLG,
						}}
					>
						<div style={{height: '100vh'}}>
							<div>
								<Dropdown
									menu={{
										items: menuItems,
									}}
									trigger={['click']}
								>
									<a onClick={(e) => e.preventDefault()}>
										<Space>
											<Button>
												Select Categories
												<DownOutlined/>
											</Button>
										</Space>
									</a>
								</Dropdown>
							</div>

							<Row style={{
								height: '100vh',
								justifyContent: 'space-evenly',
								paddingTop: 40,
							}}>
								<Col style={{width: '100vw', borderRadius: 16}} span={11}>
									<div style={{
										background: '#d1d5db',
										height: '60vh',
										alignContent: 'center',
										borderRadius: 16
									}}>
										<div className="input-group" style={{marginTop: '20px'}}>
											<label className="text-lg font-semibold">DATE OF CURRENT AFFAIRS</label>
											<DatePicker
												placeholder="Select date"
												suffixIcon={<CalendarOutlined/>}
												className="w-full"
												style={{width: '100%'}}
											/>
										</div>
										<div style={{marginTop: '20px'}}>
								<textarea
									rows={5}
									className="textarea"
									placeholder="Enter Description"
									style={{width: '100%', padding: '10px', borderRadius: '4px'}}
								/>
											<Button
												type="primary"
												className="full-width-button"
												style={{width: '100%', marginTop: '10px'}}
											>
												ENTER DESCRIPTION
											</Button>
											<Button
												type="primary"
												className="full-width-button"
												style={{width: '100%'}}
											>
												ADD MORE
											</Button>
										</div>
									</div>
								</Col>
								<Col style={{width: '100vw', borderRadius: 16}} span={11}>
									<div style={{
										background: '#d1d5db',
										height: '60vh',
										alignContent: 'center',
										borderRadius: 16
									}}>
										<div className="flex flex-col items-center gap-6" style={{marginTop: '20px'}}>
											<Upload className="w-full" style={{width: '100%'}}>
												<Button
													icon={<UploadOutlined/>}
													className="full-width-button"
													style={{width: '100%'}}
												>
													Upload Image
												</Button>
											</Upload>
											<Button
												type="primary"
												className="full-width-button"
												style={{width: '100%'}}
											>
												CHANGE PHOTO
											</Button>
											<Button
												type="primary"
												className="full-width-button"
												style={{width: '100%'}}
											>
												CONFIRM
											</Button>
										</div>
									</div>
								</Col>
								<div>
									<Button onClick={() => {
										alert('Successfully submitted')
									}}>
										CONFIRM AND SUBMIT
									</Button>
								</div>
							</Row>
						</div>
					</div>
				</Content>
			</Layout>
		</Layout>
	);
};

export default UploadAffairs;
