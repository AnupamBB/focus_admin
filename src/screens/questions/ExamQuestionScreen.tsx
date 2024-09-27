import React, {useState} from "react";
import {PlusOutlined, DeleteOutlined, DownOutlined, UserOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {Layout, Menu, Button, Form, Input, Radio, message, Dropdown, Space, MenuProps} from "antd";
import TextArea from "antd/es/input/TextArea";
import "../styles.css";

const {Header, Content, Sider} = Layout;

const ExamQuestionScreen = () => {
	const navigate = useNavigate();
	const [selectedMasterCategory, setSelectedMasterCategory] = useState('Select master category');
	const [examCategories, setExamCategories] = useState([]);

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

	const [selectedExamCategory, setSelectedExamCategory] = useState('Select exam category');
	const [questions, setQuestions] = useState([
		{
			question: "",
			description: "",
			options: [{value: "", correct: false}],
			correctOption: null,
		},
	]);
	const [jsonInput, setJsonInput] = useState("");

	// Parse JSON input and update questions state
	const handleJsonSubmit = () => {
		try {
			const parsedQuestions = JSON.parse(jsonInput);

			const formattedQuestions = parsedQuestions.map((q) => ({
				question: q.question,
				description: q.description || "",
				options: q.options.map((option) => ({
					value: option,
					correct: false,
				})),
				correctOption: null,
			}));

			setQuestions(formattedQuestions);
			message.success("Questions populated successfully");
		} catch (error) {
			message.error("Invalid JSON format");
		}
	};

	const handleQuestionChange = (index, field, value) => {
		const updatedQuestions = [...questions];
		updatedQuestions[index][field] = value;
		setQuestions(updatedQuestions);
	};

	const handleOptionChange = (questionIndex, optionIndex, value) => {
		const updatedQuestions = [...questions];
		updatedQuestions[questionIndex].options[optionIndex].value = value;
		setQuestions(updatedQuestions);
	};

	const handleCorrectOptionChange = (questionIndex, optionIndex) => {
		const updatedQuestions = [...questions];
		updatedQuestions[questionIndex].correctOption = optionIndex;
		updatedQuestions[questionIndex].options.forEach((option, index) => {
			option.correct = index === optionIndex;
		});
		setQuestions(updatedQuestions);
	};
	const handleAddOption = (questionIndex) => {
		const updatedQuestions = [...questions];
		updatedQuestions[questionIndex].options.push({value: '', correct: false});
		setQuestions(updatedQuestions);
	};

	const handleAddMoreQuestion = () => {
		setQuestions([
			...questions,
			{
				question: "",
				description: "",
				options: [{value: "", correct: false}],
				correctOption: null,
			},
		]);
	};

	const handleDeleteQuestion = (questionIndex) => {
		const updatedQuestions = questions.filter(
			(_, index) => index !== questionIndex
		);
		setQuestions(updatedQuestions);
	};

	const handleDeleteOption = (questionIndex, optionIndex) => {
		const updatedQuestions = [...questions];
		if (updatedQuestions[questionIndex].options.length > 1) {
			updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter(
				(_, index) => index !== optionIndex
			);
			setQuestions(updatedQuestions);
		} else {
			message.error("Each question must have at least one option.");
		}
	};

	const handleSubmitAll = () => {
		let isValid = true;
		questions.forEach((question, index) => {
			if (!question.question.trim()) {
				message.error(`Question ${index + 1} is missing.`);
				isValid = false;
				return;
			}
			if (question.options.length < 2) {
				message.error(
					`Question ${index + 1} must have at least two options.`
				);
				isValid = false;
				return;
			}
			if (question.correctOption === null) {
				message.error(
					`Please select a correct option for Question ${index + 1}.`
				);
				isValid = false;
				return;
			}
		});

		if (isValid) {
			console.log("Submitted Questions: ", questions);
			message.success("All questions submitted successfully");
		}
	};

	const onMenuClick = ({key}) => {
		if (key === "2") {
			navigate("/live-test-questions");
		} else if (key === "3") {
			navigate("/question-papers");
		} else if (key === "4") {
			navigate("/notes");
		} else if (key === "5") {
			navigate("/references");
		} else if (key === "6") {
			navigate("/upload-current-affairs");
		}
	};

	return (
		<Layout style={{minHeight: "100vh", minWidth: "100vw"}}>
			<Sider
				width={200}
				style={{
					background: "#f4f4f4",
					paddingTop: 20,
					boxShadow: "2px 0 8px rgba(0, 0, 0, 0.05)",
				}}
			>
				<Menu
					style={{background: "#f4f4f4"}}
					defaultSelectedKeys={["1"]}
					mode="inline"
					onClick={onMenuClick}
				>
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
				<Header
					style={{
						background: "#f4f4f4",
						textAlign: "center",
						color: "black",
						fontSize: 32,
						fontWeight: "bold",
					}}
				>
					BidYa Admin Portal
				</Header>
				<Layout style={{padding: "24px 24px 24px"}}>
					<Content
						style={{
							padding: 0,
							margin: 0,
							minHeight: 280,
							background: "#fff",
							borderRadius: "8px",
						}}
					>
						<div
							style={{
								color: "black",
								fontSize: 24,
								padding: "24px 24px 0",
							}}
						>
							Live Test Section
						</div>
						<hr
							style={{
								margin: "20px 0",
								border: "none",
								borderTop: "1px solid #e0e0e0",
							}}
						/>

						{/* SELECT CATEGORY */}
						<div style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
							<div style={{padding: '0 0 0', width: "40vw"}}>
								<div style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center'
								}}>
									<Dropdown
										menu={{items: masterCategoryItems}}
										trigger={['click']}
									>
										<a onClick={(e) => e.preventDefault()}>
											<Space>
												<Button>
													{selectedMasterCategory}
													<DownOutlined/>
												</Button>
											</Space>
										</a>
									</Dropdown>

									<Dropdown
										menu={{
											items: examCategories.map((item) => ({
												...item,
												onClick: handleExamMenuClick
											}))
										}}
										trigger={['click']}
										disabled={selectedMasterCategory === 'Select master category'}
									>
										<a onClick={(e) => e.preventDefault()}>
											<Space>
												<Button disabled={selectedMasterCategory === 'Select master category'}>
													{selectedExamCategory}
													<DownOutlined/>
												</Button>
											</Space>
										</a>
									</Dropdown>
								</div>
							</div>
						</div>

						<div
							style={{
								display: "flex",
								justifyContent: "center",
								flexDirection: "row",
								marginTop: "24px"
							}}
						>
							<iframe
								src="https://focus-mcq-extract.streamlit.app/?embedded=true"
								width="80%"
								height="500px"
							></iframe>
						</div>

						{/* JSON input section */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Form.Item
								label="Paste JSON of Questions"
								labelCol={{
									style: {
										display: "flex",
										flexDirection: "column",
										justifyContent: "start",
										width: "100%",
										marginBottom: "8px",
									},
								}}
								style={{paddingTop: "24px", minWidth: "40vw"}}
							>
								<TextArea
									rows={6}
									value={jsonInput}
									onChange={(e) =>
										setJsonInput(e.target.value)
									}
									placeholder='[{"question": "Question 1", "options": ["Option 1", "Option 2"]}, {"question": "Question 2", "options": ["Option A", "Option B"]}]'
								/>
								<Button
									style={{marginTop: "24px"}}
									type="primary"
									onClick={handleJsonSubmit}
								>
									Populate Questions
								</Button>
							</Form.Item>
						</div>

						{questions.map((question, questionIndex) => (
							<div
								key={questionIndex}
								style={{
									display: "flex",
									justifyContent: "center",
									flexDirection: "row",
									marginBottom: "20px",
									padding: "20px",
								}}
							>
								<Form
									style={{
										minWidth: "32vw",
										display: "flex",
										flexDirection: "row",
										gap: "20px",
										alignItems: "center",
										border: "1px solid #e0e0e0",
										padding: 20,
										borderRadius: "8px",
									}}
								>
									<div style={{flex: 2}}>
										<Form.Item
											label={`Enter Question ${
												questionIndex + 1
											}`}
											labelCol={{
												style: {
													display: "flex",
													width: "140px",
												},
											}}
										>
											<div
												style={{
													display: "flex",
													justifyContent:
														"space-between",
													width: "100%",
												}}
											>
												<Input
													placeholder="Your question goes here..."
													value={question.question}
													onChange={(e) =>
														handleQuestionChange(
															questionIndex,
															"question",
															e.target.value
														)
													}
													style={{width: "300px"}}
												/>
												<Button
													type="primary"
													danger
													onClick={() =>
														handleDeleteQuestion(
															questionIndex
														)
													}
													style={{width: "30%"}}
												>
													<DeleteOutlined/> Delete
													Question
												</Button>
											</div>
										</Form.Item>

										<Form.Item
											label="Options"
											labelCol={{
												style: {
													display: "flex",
													width: "140px",
													alignItems: "start",
												},
											}}
										>
											{question.options.map(
												(option, optionIndex) => (
													<div
														key={optionIndex}
														style={{
															display: "flex",
															alignItems:
																"center",
															gap: "10px",
															marginBottom:
																"10px",
														}}
													>
														<Input
															placeholder={`Option ${
																optionIndex + 1
															}`}
															value={option.value}
															onChange={(e) =>
																handleOptionChange(
																	questionIndex,
																	optionIndex,
																	e.target
																		.value
																)
															}
															style={{
																width: "300px",
															}}
														/>
														<Radio
															checked={
																question.correctOption ===
																optionIndex
															}
															onChange={() =>
																handleCorrectOptionChange(
																	questionIndex,
																	optionIndex
																)
															}
														>
															Correct
														</Radio>
														<Button
															type="primary"
															danger
															onClick={() =>
																handleDeleteOption(
																	questionIndex,
																	optionIndex
																)
															}
														>
															<DeleteOutlined/>
														</Button>
													</div>
												)
											)}
										</Form.Item>
										<div
											style={{display: 'flex', justifyContent: "center",}}>
											<Button type="dashed" onClick={() => handleAddOption(questionIndex)}>
												<PlusOutlined/> Add Option
											</Button></div>
									</div>
								</Form>
							</div>
						))}

						<Form.Item
							style={{
								display: "flex",
								justifyContent: "center",
							}}
						>
							<Button
								type="primary"
								onClick={handleAddMoreQuestion}
								style={{
									background: "#4CAF50",
									marginRight: "20px",
								}}
							>
								<PlusOutlined/> Add Question
							</Button>
							<Button
								type="primary"
								onClick={handleSubmitAll}
								style={{background: "#4CAF50"}}
							>
								Submit All
							</Button>
						</Form.Item>
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
};

export default ExamQuestionScreen;
