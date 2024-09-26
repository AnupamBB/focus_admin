import { useState } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Form, Input, Radio, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import "../styles.css";

const { Header, Content, Sider } = Layout;

const ExamQuestionScreen = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([
        {
            question: "",
            description: "",
            options: [{ value: "", correct: false }],
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

    const handleAddMoreQuestion = () => {
        setQuestions([
            ...questions,
            {
                question: "",
                description: "",
                options: [{ value: "", correct: false }],
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
        updatedQuestions[questionIndex].options = updatedQuestions[
            questionIndex
        ].options.filter((_, index) => index !== optionIndex);
        setQuestions(updatedQuestions);
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

    const onMenuClick = ({ key }) => {
        if (key === "1") {
            navigate("/dashboard");
        } else if (key === "2") {
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
                                style={{ paddingTop: "24px", minWidth: "40vw" }}
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
                                    style={{ marginTop: "24px" }}
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

export default ExamQuestionScreen;
