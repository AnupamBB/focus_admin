import React, {useState} from 'react';
import {UploadOutlined, PlusOutlined, DeleteOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {Layout, Menu, theme, Button, Upload, message, Form, Input} from 'antd';
import '../styles.css';

const {Header, Content, Sider} = Layout;

const QuestionPapers = () => {
	const [notes, setNotes] = useState([{title: '', pdfFile: []}]); // Array to store notes
	const navigate = useNavigate();
	const {
		token: {colorBgContainer, borderRadiusLG},
	} = theme.useToken();

	const normFile = (e) => {
		if (Array.isArray(e)) {
			return e;
		}
		return e?.fileList;
	};

	const handleChange = (index, field, value) => {
		const updatedNotes = [...notes];
		updatedNotes[index][field] = value;
		setNotes(updatedNotes);
	};

	const handleFileChange = (index, {fileList}) => {
		const updatedNotes = [...notes];
		updatedNotes[index].pdfFile = fileList.slice(-1);
		setNotes(updatedNotes);
	};

	const handleAddMore = () => {
		setNotes([...notes, {title: '', pdfFile: []}]);
	};

	const handleDeleteNote = (index) => {
		const updatedNotes = [...notes];
		updatedNotes.splice(index, 1);
		setNotes(updatedNotes);
	};

	const handleSubmitAll = () => {
		console.log('All notes submitted:', notes);

		setNotes([{title: '', pdfFile: []}]);
		message.success('All notes submitted successfully');
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
					<div style={{textAlign: 'center', color: 'black', fontSize: 32, fontWeight: 'bold'}}>BidYa Admin
						Portal
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
						<div style={{color: 'black', fontSize: 24, padding: '24px 24px 0'}}>QuestionPapers Section</div>
						<hr style={{margin: '20px 0', border: 'none', borderTop: '1px solid #e0e0e0'}}/>

						{notes.map((note, index) => (
							<div key={index} style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
								<Form style={{
									width: '50%',
									display: 'flex',
									flexDirection: 'row',
									gap: '20px',
									borderWidth: 1,
									padding: 20,
									justifyContent: 'center'
								}}>
									<div style={{flex: 2}}>
										<Form.Item label={`Enter Title ${index + 1}`}>
											<Input
												placeholder="Enter Title"
												value={note.title}
												onChange={(e) => handleChange(index, 'title', e.target.value)}
												style={{width: '100%'}}
											/>
										</Form.Item>
									</div>
									<div>
										<Form.Item label="Upload PDF">
											<Upload
												accept=".pdf"
												fileList={note.pdfFile}
												beforeUpload={() => false}
												onChange={(file) => handleFileChange(index, file)}
												maxCount={1}
											>
												<Button icon={<UploadOutlined/>}>Select PDF</Button>
											</Upload>
										</Form.Item>
									</div>
									<div>
										<Button
											type="danger"
											onClick={() => handleDeleteNote(index)}
											style={{width: '100%', backgroundColor: '#f35757'}}
											disabled={notes.length === 1}
										>
											<DeleteOutlined/> Delete
										</Button>
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
								Submit All Papers
							</Button>
						</Form.Item>
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
};

export default QuestionPapers;
