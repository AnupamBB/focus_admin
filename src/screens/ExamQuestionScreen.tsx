import React from 'react';
import {UploadOutlined, UserOutlined, VideoCameraOutlined} from '@ant-design/icons';
import {Layout, Menu, theme, Typography, Grid, Button, Radio, Space, Input} from 'antd';
import './styles.css'

const {Header, Content, Footer, Sider} = Layout;
const items = [UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
	(icon, index) => ({
		key: String(index + 1),
		icon: React.createElement(icon),
		label: `nav ${index + 1}`,
	}),
);
const {Title} = Typography;
const {useToken} = theme;
const {useBreakpoint} = Grid;

const ExamQuestionScreen = () => {

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
						<div className="exam-form">
							{[1, 2, 3, 4].map((question, qIndex) => (
								<div key={qIndex} className="question-block">
									<div className="question-row">
										<span className="text-lg font-bold">{qIndex + 1}</span>
										<Input placeholder="Enter question"/>
									</div>

									<div className="options-row">
										<div>
											{[1, 2, 3, 4].map((option, oIndex) => (
												<div key={oIndex} className="option-block">
													<Radio>
														<Space>
															<Input placeholder={`Option ${oIndex + 1}`}/>
														</Space>
													</Radio>
												</div>
											))}
											<Button className="full-width-button">Add Option</Button>
										</div>

										<div className="flex flex-col items-center">
											<Button className="full-width-button mb-4" size="large">
												CONFIRM ANSWER
											</Button>
											<Button className="full-width-button" size="large">
												SAVE
											</Button>
										</div>
									</div>
								</div>
							))}

							<div className="action-buttons">
								<Button className="full-width-button">Add Question</Button>
								<Button className="full-width-button">CONFIRM CHANGES AND EXIT</Button>
							</div>
						</div>
					</div>
				</Content>
			</Layout>
		</Layout>
	);
};
export default ExamQuestionScreen;