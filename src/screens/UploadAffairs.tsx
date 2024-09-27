import React, {useState} from 'react';
import {PlusOutlined, DeleteOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {Layout, Menu, theme, Button, DatePicker, Form, Input, Upload, Select, message} from 'antd';
import './styles.css';
import TextArea from "antd/es/input/TextArea";

const {Header, Content, Sider} = Layout;
const {useToken} = theme;

const UploadAffairs = () => {
	const navigate = useNavigate();
	const [options, setOptions] = useState([
		{value: 'world', label: 'World'},
		{value: 'india', label: 'India'},
		{value: 'economics', label: 'Economics'},
		{value: 'assam', label: 'Assam'},
	]);

	const [affairs, setAffairs] = useState([
		{
			date: null,
			classification: '',
			title: '',
			description: '',
			image: [],
			showInput: false,
			newOptionValue: '',
			selectDisabled: false
		}
	]);

	const handleSelectChange = (index, value) => {
		const updatedAffairs = [...affairs];

		if (value === 'add_new') {
			updatedAffairs[index].showInput = true;
			updatedAffairs[index].selectDisabled = true;
		} else {
			updatedAffairs[index].classification = value;
		}
		setAffairs(updatedAffairs);
	};

	const handleSaveNewOption = (index) => {
		const updatedAffairs = [...affairs];
		const newClassification = updatedAffairs[index].newOptionValue;

		if (newClassification) {
			const newOptions = [...options, {value: newClassification.toLowerCase(), label: newClassification}];
			setOptions(newOptions);

			updatedAffairs[index].classification = newClassification.toLowerCase();
			updatedAffairs[index].showInput = false;
			updatedAffairs[index].selectDisabled = false;
			updatedAffairs[index].newOptionValue = '';
			setAffairs(updatedAffairs);
		}
	};

	const handleCancel = (index) => {
		const updatedAffairs = [...affairs];
		updatedAffairs[index].newOptionValue = '';
		updatedAffairs[index].showInput = false;
		updatedAffairs[index].selectDisabled = false;
		setAffairs(updatedAffairs);
	};

	const handleAddMore = () => {
		setAffairs([
			...affairs,
			{
				date: null,
				classification: '',
				title: '',
				description: '',
				image: [],
				showInput: false,
				newOptionValue: '',
				selectDisabled: false
			}
		]);
	};

	const handleDeleteAffair = (index) => {
		const updatedAffairs = [...affairs];
		updatedAffairs.splice(index, 1);
		setAffairs(updatedAffairs);
	};

	const handleChange = (index, field, value) => {
		const updatedAffairs = [...affairs];
		updatedAffairs[index][field] = value;
		setAffairs(updatedAffairs);
	};

	const handleFileChange = (index, {fileList}) => {
		const updatedAffairs = [...affairs];
		updatedAffairs[index].image = fileList.slice(-1);
		setAffairs(updatedAffairs);
	};

	const handleSubmitAll = () => {
		console.log('All affairs submitted:', affairs);
		setAffairs([{
			date: null,
			classification: '',
			title: '',
			description: '',
			image: [],
			showInput: false,
			newOptionValue: '',
			selectDisabled: false
		}]);
		message.success('All affairs submitted successfully');
	};


	const onMenuClick = ({key}) => {
		if (key === '2') {
			navigate('/live-test-questions');
		} else if (key === '3') {
			navigate('/question-papers');
		} else if (key === '4') {
			navigate('/notes');
		} else if (key === '5') {
			navigate('/references');
		} else if (key === '6') {
			navigate('/upload-current-affairs');
		}
	};

	return (
		<Layout style={{minHeight: '100vh', minWidth: '100vw'}}>
			<Sider
				width={200}
				style={{background: '#f4f4f4', paddingTop: 20, boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)'}}
			>
				<Menu style={{background: '#f4f4f4'}} defaultSelectedKeys={['1']} mode="inline" onClick={onMenuClick}>
					<Menu.SubMenu key="sub1" title="Exams">
						<Menu.Item key="2">Live Test Questions</Menu.Item>
						<Menu.Item key="3">Question Papers</Menu.Item>
						<Menu.Item key="4">Notes</Menu.Item>
						<Menu.Item key="5">References</Menu.Item>
					</Menu.SubMenu>
					<Menu.Item key="6">Current Affairs</Menu.Item>
				</Menu>
			</Sider>
			<Layout>
				<Header style={{
					background: '#f4f4f4',
					textAlign: 'center',
					color: 'black',
					fontSize: 32,
					fontWeight: 'bold'
				}}>
					BidYa Admin Portal
				</Header>
				<Layout style={{padding: '24px 24px 24px'}}>
					<Content
						style={{
							padding: 0,
							margin: 0,
							minHeight: 280,
							background: '#fff',
							borderRadius: '8px',
						}}
					>
						<div style={{color: 'black', fontSize: 24, padding: '24px 24px 0'}}>Current Affairs Section
						</div>
						<hr style={{margin: '20px 0', border: 'none', borderTop: '1px solid #e0e0e0'}}/>

						{affairs.map((affair, index) => (
							<div key={index} style={{
								display: 'flex',
								justifyContent: 'center',
								flexDirection: 'row',
								marginBottom: '20px',
								padding: '20px'
							}}>
								<Form style={{
									minWidth: "40vw",
									display: 'flex',
									flexDirection: 'row',
									gap: '20px',
									alignItems: 'center',
									border: '1px solid #e0e0e0',
									padding: 20,
									borderRadius: '8px',
								}}>
									<div style={{flex: 2}}>
										<Form.Item label={`Current Affair Date ${index + 1}`} labelCol={{
											style: {
												display: "flex",
												width: "140px",
												alignItems: "start",
											},
										}}>
											<DatePicker
												style={{width: '360px'}}
												value={affair.date}
												onChange={(date) => handleChange(index, 'date', date)}
											/>
										</Form.Item>
										<Form.Item label="Select Classification" labelCol={{
											style: {
												display: "flex",
												width: "140px",
												alignItems: "start",
											},
										}}>
											<Select
												placeholder="Please select"
												onChange={(value) => handleSelectChange(index, value)}
												value={affair.classification}
												style={{width: '360px'}}
												disabled={affair.selectDisabled}

											>
												{options.map((option) => (
													<Select.Option key={option.value} value={option.value}>
														{option.label}
													</Select.Option>
												))}
												<Select.Option value="add_new" key="add_new">
													Add New
												</Select.Option>
											</Select>
										</Form.Item>

										{affair.showInput && (
											<div style={{
												marginTop: '10px',
												marginBottom: '20px',
												display: 'flex',
												alignItems: 'center',
												gap: '10px',
												justifyContent: 'center'
											}}>
												<Input
													placeholder="Enter new classification"
													value={affair.newOptionValue}
													onChange={(e) => handleChange(index, 'newOptionValue', e.target.value)}
													style={{width: '360px'}}
												/>
												<Button type="primary" onClick={() => handleSaveNewOption(index)}>
													Save
												</Button>
												<Button onClick={() => handleCancel(index)}>Cancel</Button>
											</div>
										)}

										<Form.Item label="Enter Title" labelCol={{
											style: {
												display: "flex",
												width: "140px",
												alignItems: "start",
											},
										}}>
											<Input
												placeholder="Enter Title"
												value={affair.title}
												onChange={(e) => handleChange(index, 'title', e.target.value)}
												style={{width: '360px'}}
											/>
										</Form.Item>

										<Form.Item label="Enter Description" labelCol={{
											style: {
												display: "flex",
												width: "140px",
												alignItems: "start",
											},
										}}>
											<TextArea
												rows={4}
												value={affair.description}
												onChange={(e) => handleChange(index, 'description', e.target.value)}
												style={{width: '360px'}}
											/>
										</Form.Item>
									</div>
									<div>
										<Form.Item valuePropName="fileList">
											<Upload
												action="/upload.do"
												listType="picture-card"
												fileList={affair.image}
												onChange={(file) => handleFileChange(index, file)}
												maxCount={1}
											>
												{affair.image.length < 1 && (
													<button style={{border: 0, background: 'none'}} type="button">
														<PlusOutlined/>
														<div style={{marginTop: 8}}>Upload Image</div>
													</button>
												)}
											</Upload>
										</Form.Item>
									</div>
									<div>
										<Form.Item>
											<Button
												type="danger"
												onClick={() => handleDeleteAffair(index)}
												style={{width: '100%'}}
												disabled={affairs.length === 1}
											>
												<DeleteOutlined/> Delete
											</Button>
										</Form.Item>
									</div>
								</Form>
							</div>
						))}

						<Form.Item style={{display: 'flex', justifyContent: 'center'}}>
							<Button type="primary" onClick={handleAddMore} style={{width: '100%'}}>
								Add More
							</Button>
						</Form.Item>

						<Form.Item style={{display: 'flex', justifyContent: 'center'}}>
							<Button type="primary" onClick={handleSubmitAll} style={{width: '100%'}}>
								Submit All Affairs
							</Button>
						</Form.Item>
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
};

export default UploadAffairs;
