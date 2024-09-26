import React, {useState} from 'react';
import {PlusOutlined, DeleteOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {Layout, Menu, theme, Button, Upload, Input, Form, message} from 'antd';
import '../styles.css';

const {Header, Content, Sider} = Layout;

const References = () => {
	const [references, setReferences] = useState([{title: '', link: '', image: []}]); // Array to store references
	const navigate = useNavigate();
	const {
		token: {colorBgContainer, borderRadiusLG},
	} = theme.useToken();

	const normFile = (e: any) => {
		if (Array.isArray(e)) {
			return e;
		}
		return e?.fileList;
	};

	const handleAddMore = () => {
		setReferences([...references, {title: '', link: '', image: []}]); // Add new reference input
	};

	const handleDeleteReference = (index) => {
		const updatedReferences = [...references];
		updatedReferences.splice(index, 1); // Remove reference at the given index
		setReferences(updatedReferences);
	};

	const handleChange = (index, field, value) => {
		const updatedReferences = [...references];
		updatedReferences[index][field] = value;
		setReferences(updatedReferences); // Auto-save the specific reference's title, link, or image
	};

	const getBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};

	const handleFileChange = async (index, {fileList}) => {
		const updatedReferences = [...references];
		if (fileList.length > 0) {
			const base64Image = await getBase64(fileList[0].originFileObj);
			updatedReferences[index].image = [{...fileList[0], base64: base64Image}]; // store image as base64
		} else {
			updatedReferences[index].image = [];
		}
		setReferences(updatedReferences);
	};

	const handleSubmitAll = async () => {
		try {
			const reference = references[0];
			const payload = {
				action: "create",
				title: reference.title,
				referenceImg: reference.image.length > 0 ? reference.image[0].base64.split(",")[1] : "",
				link: reference.link
			};

			console.log(payload);

			const response = await fetch('https://examappbackend.onrender.com/api/v1/app/admin/references', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				const responseData = await response.json();
				console.log('Response from server:', responseData);
				message.success('Reference submitted successfully');
			} else {
				const errorResponse = await response.json();
				console.error('Error response:', errorResponse);
				message.error('Failed to submit reference');
			}
		} catch (error) {
			console.error('Error submitting reference:', error);
			message.error('An error occurred while submitting');
		}

		setReferences([{title: '', link: '', image: []}]);
	};

	const onMenuClick = ({key}) => {
		if (key === '1') {
			navigate('/dashboard');
		} else if (key === '2') {
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
					<Menu.Item key="1">Dashboard</Menu.Item>
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
				<Header style={{background: colorBgContainer}}>
					<div style={{textAlign: 'center', color: 'black', fontSize: 32, fontWeight: 'bold'}}>
						BidYa Admin Portal
					</div>
				</Header>
				<Layout style={{padding: '24px 24px 24px', flexDirection: 'row', gap: 24}}>
					<Content
						style={{
							padding: 0,
							margin: 0,
							minHeight: 280,
							background: colorBgContainer,
							borderRadius: borderRadiusLG,
						}}
					>
						<div style={{color: 'black', fontSize: 24, padding: '24px 24px 0'}}>References Section</div>
						<hr style={{margin: '20px 0', border: 'none', borderTop: '1px solid #e0e0e0'}}/>

						{references.map((reference, index) => (
							<div
								key={index}
								style={{
									display: 'flex',
									justifyContent: 'center',
									flexDirection: 'row',
									marginBottom: '20px',
								}}
							>
								<Form style={{
									width: '50%', display: 'flex', flexDirection: 'row', gap: '20px', borderWidth: 1,
									justifyContent: 'center',
									padding: 20, alignItems: 'center'
								}}>
									<div style={{flex: 2}}>
										<Form.Item label={`Enter Reference Title ${index + 1}`}>
											<Input
												placeholder="Enter Reference Title"
												value={reference.title}
												onChange={(e) => handleChange(index, 'title', e.target.value)}
												style={{width: '100%'}}
											/>
										</Form.Item>
										<Form.Item label="Enter Reference Link">
											<Input
												placeholder="Enter Reference Link"
												value={reference.link}
												onChange={(e) => handleChange(index, 'link', e.target.value)}
												style={{width: '100%'}}
											/>
										</Form.Item>

									</div>
									<div style={{display: 'flex'}}>
										<Form.Item valuePropName="fileList" getValueFromEvent={normFile}>
											<Upload
												action="/upload.do"
												listType="picture-card"
												fileList={reference.image}
												onChange={(file) => handleFileChange(index, file)}
												maxCount={1}
											>
												{reference.image.length < 1 && (
													<button style={{border: 0, background: 'none'}} type="button">
														<PlusOutlined/>
														<div style={{marginTop: 8}}>Upload Image</div>
													</button>
												)}
											</Upload>
										</Form.Item>
									</div>
									<div style={{display: 'flex'}}>
										<Form.Item>
											<Button
												type="danger"
												onClick={() => handleDeleteReference(index)}
												style={{width: '100%', backgroundColor: '#f35757'}}
												disabled={references.length === 1}
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
								Submit All References
							</Button>
						</Form.Item>
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
};

export default References;
