import { useState } from "react";
import {
    PlusOutlined,
    DeleteOutlined,
    DownOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
    Layout,
    Menu,
    Button,
    Form,
    Input,
    Radio,
    message,
    Dropdown,
    Space,
    MenuProps,
    Upload,
} from "antd";
import "../styles.css";

const { Header, Content, Sider } = Layout;

const EditExamQuestion = () => {
    const navigate = useNavigate();
    const [selectedMasterCategory, setSelectedMasterCategory] = useState(
        "Select master category"
    );
    const [examCategories, setExamCategories] = useState([]);
    const [examName, setExamName] = useState("");
    const [globalPositiveMark, setGlobalPositiveMark] = useState();
    const [globalNegativeMark, setGlobalNegativeMark] = useState();
    const [image, setImage] = useState(null);

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const applyMarksToAll = () => {
        const updatedQuestions = questions.map((q) => ({
            ...q,
            positiveMark: globalPositiveMark,
            negativeMark: globalNegativeMark,
        }));
        setQuestions(updatedQuestions);
        message.success("Marks applied to all questions");
    };

    const handleSubmitAll = async () => {
        let isValid = true;

        if (!examName.trim()) {
            message.error("Please provide an exam name.");
            isValid = false;
            return;
        }

        if (selectedMasterCategory === "Select master category") {
            message.error("Please select a master category.");
            isValid = false;
            return;
        }
        if (selectedExamCategory === "Select exam category") {
            message.error("Please select an exam category.");
            isValid = false;
            return;
        }

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
            if (
                question.positiveMark === undefined ||
                question.negativeMark === undefined
            ) {
                message.error(
                    `Please provide marks for Question ${index + 1}.`
                );
                isValid = false;
                return;
            }
        });

        if (isValid) {
            try {
                let base64Image = null;
                if (image) {
                    base64Image = await getBase64(image);
                }

                const payload = {
                    exam_name: examName,
                    exam_image: base64Image,
                    exam_category: selectedExamCategory,
                    master_category: selectedMasterCategory,
                    duration: 3600,
                    questions: questions.map((q) => ({
                        question_title: q.question,
                        options: q.options.map((opt) => opt.value),
                        correct_answer: q.options[q.correctOption]?.value,
                        question_category: "Question Category",
                        positive_mark: q.positiveMark,
                        negative_mark: q.negativeMark,
                    })),
                };

                const accessToken = localStorage.getItem("accessToken");
                const response = await fetch(
                    "https://examappbackend.onrender.com/api/v1/app/admin/add-exam",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify(payload),
                    }
                );

                if (response.ok) {
                    message.success("All data submitted successfully!");
                    setExamName("");
                    setImage(null);
                    setQuestions([
                        {
                            question: "",
                            description: "",
                            options: [{ value: "", correct: false }],
                            correctOption: null,
                        },
                    ]);
                } else {
                    message.error("Failed to submit exam data.");
                }
            } catch (error) {
                console.error("Error submitting exam data:", error);
                message.error("Error submitting exam data.");
            }
        }
    };

    const examCategoryMap = {
        Engineering: [
            { label: "GATE", key: "1" },
            { label: "IES", key: "2" },
            { label: "IES 2", key: "3" },
            { label: "JEE", key: "3" },
            { label: "BITSAT", key: "3" },
            { label: "VITEEE", key: "3" },
        ],
        Banking: [
            { label: "IBPS", key: "1" },
            { label: "SBI", key: "2" },
        ],
        Law: [
            { label: "Corporate", key: "1" },
            { label: "Criminal", key: "2" },
        ],
        Management: [
            { label: "HR", key: "1" },
            { label: "Finance", key: "2" },
        ],
        Medical: [
            { label: "MBBS", key: "1" },
            { label: "BDS", key: "2" },
        ],
    };
    const handleMenuClick: MenuProps["onClick"] = (e) => {
        const selectedMaster = e.domEvent.currentTarget.innerText;
        setSelectedMasterCategory(selectedMaster);
        setExamCategories(examCategoryMap[selectedMaster]);
        setSelectedExamCategory("Select exam category");
        message.info(`Selected ${selectedMaster}`);
    };

    const handleExamMenuClick: MenuProps["onClick"] = (e) => {
        const selectedExam = e.domEvent.currentTarget.innerText;
        setSelectedExamCategory(selectedExam);
        message.info(`Selected ${selectedExam}`);
    };

    const masterCategoryItems: MenuProps["items"] = [
        {
            label: "Engineering",
            key: "1",
            icon: <UserOutlined />,
            onClick: handleMenuClick,
        },
        {
            label: "Banking",
            key: "2",
            icon: <UserOutlined />,
            onClick: handleMenuClick,
        },
        {
            label: "Law",
            key: "3",
            icon: <UserOutlined />,
            onClick: handleMenuClick,
        },
        {
            label: "Management",
            key: "4",
            icon: <UserOutlined />,
            onClick: handleMenuClick,
        },
        {
            label: "Medical",
            key: "5",
            icon: <UserOutlined />,
            onClick: handleMenuClick,
        },
    ];

    const [selectedExamCategory, setSelectedExamCategory] = useState(
        "Select exam category"
    );
    const [questions, setQuestions] = useState([
        {
            question: "",
            description: "",
            options: [{ value: "", correct: false }],
            correctOption: null,
        },
    ]);
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
        updatedQuestions[questionIndex].options.push({
            value: "",
            correct: false,
        });
        setQuestions(updatedQuestions);
    };

    const handleAddMoreQuestion = () => {
        setQuestions([
            ...questions,
            {
                question: "",
                description: "",
                options: [{ value: "", correct: false }],
                correctOption: null,
                positiveMark: 1,
                negativeMark: 0,
            },
        ]);
    };

    const handleDeleteQuestion = (questionIndex) => {
        if (questions.length > 1) {
            const updatedQuestions = questions.filter(
                (_, index) => index !== questionIndex
            );
            setQuestions(updatedQuestions);
        } else {
            message.error("At least one question is required.");
        }
    };

    const handleDeleteOption = (questionIndex, optionIndex) => {
        const updatedQuestions = [...questions];
        if (updatedQuestions[questionIndex].options.length > 1) {
            updatedQuestions[questionIndex].options = updatedQuestions[
                questionIndex
            ].options.filter((_, index) => index !== optionIndex);
            setQuestions(updatedQuestions);
        } else {
            message.error("Each question must have at least one option.");
        }
    };

    const handleImageUpload = (file) => {
        setImage(file);
        return false;
    };

    const handleRemoveImage = () => {
        setImage(null);
    };

    const onMenuClick = ({ key }) => {
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
        <Layout style={{ minHeight: "100vh", minWidth: "100vw" }}>
            <Sider
                width={200}
                style={{
                    background: "#f4f4f4",
                    paddingTop: 20,
                    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.05)",
                }}
            >
                <Menu
                    style={{ background: "#f4f4f4" }}
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
                    Focus Admin Portal
                </Header>
                <Layout style={{ padding: "24px 24px 24px" }}>
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

                        <div
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
                                    minWidth: "40vw",
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: "20px",
                                    alignItems: "center",
                                    border: "1px solid #e0e0e0",
                                    padding: 20,
                                    borderRadius: "8px",
                                }}
                            >
                                <div style={{ flex: 2 }}>
                                    <Form.Item
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
                                                justifyContent: "space-between",
                                                width: "100%",
                                            }}
                                        >
                                            <Dropdown
                                                menu={{
                                                    items: masterCategoryItems,
                                                }}
                                                trigger={["click"]}
                                            >
                                                <a
                                                    onClick={(e) =>
                                                        e.preventDefault()
                                                    }
                                                >
                                                    <Space>
                                                        <Button>
                                                            {
                                                                selectedMasterCategory
                                                            }
                                                            <DownOutlined />
                                                        </Button>
                                                    </Space>
                                                </a>
                                            </Dropdown>
                                            <Dropdown
                                                menu={{
                                                    items: examCategories.map(
                                                        (item) => ({
                                                            ...item,
                                                            onClick:
                                                                handleExamMenuClick,
                                                        })
                                                    ),
                                                }}
                                                trigger={["click"]}
                                                disabled={
                                                    selectedMasterCategory ===
                                                    "Select master category"
                                                }
                                            >
                                                <a
                                                    onClick={(e) =>
                                                        e.preventDefault()
                                                    }
                                                >
                                                    <Space>
                                                        <Button
                                                            disabled={
                                                                selectedMasterCategory ===
                                                                "Select master category"
                                                            }
                                                        >
                                                            {
                                                                selectedExamCategory
                                                            }
                                                            <DownOutlined />
                                                        </Button>
                                                    </Space>
                                                </a>
                                            </Dropdown>
                                            <Input
                                                placeholder="Exam name"
                                                value={examName}
                                                onChange={(e) =>
                                                    setExamName(e.target.value)
                                                }
                                                style={{ width: "300px" }}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                width: "100%",
                                                marginTop: "20px",
                                            }}
                                        >
                                            <Input
                                                placeholder="Positive Mark"
                                                type="number"
                                                value={globalPositiveMark}
                                                onChange={(e) =>
                                                    setGlobalPositiveMark(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                style={{ width: "150px" }}
                                            />
                                            <Input
                                                placeholder="Negative Mark"
                                                type="number"
                                                value={globalNegativeMark}
                                                onChange={(e) =>
                                                    setGlobalNegativeMark(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                style={{ width: "150px" }}
                                            />
                                            <Button
                                                type="primary"
                                                onClick={applyMarksToAll}
                                            >
                                                Apply Marks to All
                                            </Button>
                                        </div>
                                    </Form.Item>
                                </div>
                                <Form.Item valuePropName="fileList">
                                    <Upload
                                        action="/upload.do"
                                        listType="picture-card"
                                        beforeUpload={handleImageUpload}
                                        maxCount={1}
                                        onRemove={handleRemoveImage}
                                        fileList={image ? [image] : []}
                                    >
                                        {!image && (
                                            <button
                                                style={{
                                                    border: 0,
                                                    background: "none",
                                                }}
                                                type="button"
                                            >
                                                <PlusOutlined />
                                                <div
                                                    style={{
                                                        marginTop: 8,
                                                        color: "black",
                                                    }}
                                                >
                                                    Upload Image
                                                </div>
                                            </button>
                                        )}
                                    </Upload>
                                </Form.Item>
                            </Form>
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
                                        minWidth: "40vw",
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: "20px",
                                        alignItems: "center",
                                        border: "1px solid #e0e0e0",
                                        padding: 20,
                                        borderRadius: "8px",
                                    }}
                                >
                                    <div style={{ flex: 2 }}>
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
                                                    style={{ width: "300px" }}
                                                />
                                                <Button
                                                    type="primary"
                                                    danger
                                                    onClick={() =>
                                                        handleDeleteQuestion(
                                                            questionIndex
                                                        )
                                                    }
                                                    style={{ width: "30%" }}
                                                >
                                                    <DeleteOutlined /> Delete
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
                                                            <DeleteOutlined />
                                                        </Button>
                                                    </div>
                                                )
                                            )}
                                        </Form.Item>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                marginBottom: "30px",
                                            }}
                                        >
                                            <Button
                                                type="dashed"
                                                onClick={() =>
                                                    handleAddOption(
                                                        questionIndex
                                                    )
                                                }
                                            >
                                                <PlusOutlined /> Add Option
                                            </Button>
                                        </div>
                                        <div style={{ display: "flex" }}>
                                            <Form.Item
                                                label="Marks"
                                                labelCol={{
                                                    style: {
                                                        display: "flex",
                                                        width: "140px",
                                                        alignItems: "start",
                                                    },
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "10px",
                                                        marginBottom: "10px",
                                                    }}
                                                >
                                                    <Input
                                                        placeholder={`Positive Marks`}
                                                        type="number"
                                                        value={
                                                            question.positiveMark
                                                        }
                                                        onChange={(e) =>
                                                            handleQuestionChange(
                                                                questionIndex,
                                                                "positiveMark",
                                                                e.target.value
                                                            )
                                                        }
                                                        style={{
                                                            width: "300px",
                                                        }}
                                                    />
                                                </div>
                                                <Input
                                                    placeholder={`Negative Marks`}
                                                    type="number"
                                                    value={
                                                        question.negativeMark
                                                    }
                                                    onChange={(e) =>
                                                        handleQuestionChange(
                                                            questionIndex,
                                                            "negativeMark",
                                                            e.target.value
                                                        )
                                                    }
                                                    style={{
                                                        width: "300px",
                                                    }}
                                                />
                                            </Form.Item>
                                        </div>
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
                                <PlusOutlined /> Add Question
                            </Button>
                            <Button
                                type="primary"
                                onClick={handleSubmitAll}
                                style={{ background: "#4CAF50" }}
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

export default EditExamQuestion;
