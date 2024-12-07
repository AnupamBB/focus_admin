import { useEffect, useState } from "react";
import { PlusOutlined, DeleteOutlined, DownOutlined } from "@ant-design/icons";
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
    Upload,
    TimePicker,
    Spin,
    Modal,
} from "antd";
import "../styles.css";

const { Header, Content, Sider } = Layout;

const ExamQuestionScreen = () => {
    const navigate = useNavigate();
    const [masterCategoryItems, setMasterCategoryItems] = useState([]);
    const [selectedMasterCategory, setSelectedMasterCategory] = useState(
        "Select master category"
    );
    const [examCategories, setExamCategories] = useState([]);
    const [examName, setExamName] = useState("");
    const [globalPositiveMark, setGlobalPositiveMark] = useState();
    const [globalNegativeMark, setGlobalNegativeMark] = useState();
    const [image, setImage] = useState(null);
    const [masterImage, setMasterImage] = useState(null);
    const [examCategoryImage, setExamCategoryImage] = useState(null);
    const [timeValue, setTimeValue] = useState<Dayjs | null>(null);
    const [loading, setLoading] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDocumentExtracted, setIsDocumentExtracted] = useState(false);
    const [extractedQuestions, setExtractedQuestions] = useState([]);
    const [jsonInput, setJsonInput] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
        setIsDocumentExtracted(false);
    };

    const handleJsonExtraction = async () => {
        if (!selectedFile) {
            message.error("Please select a file before extraction.");
            return;
        }

        try {
            const accessToken = localStorage.getItem("accessToken");
            setLoading(true);
            const fileToBase64 = (file: File): Promise<string> =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        const base64String = (reader.result as string).replace(
                            /^data:(.*?);base64,/,
                            ""
                        );
                        resolve(base64String);
                    };
                    reader.onerror = (error) => reject(error);
                });

            const base64File = await fileToBase64(selectedFile);

            const payload = { base64: base64File };
            console.log("=============", payload);
            const response = await fetch(
                "https://examappbackend-0mts.onrender.com/api/v1/extract_questions",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.statuscode === 200) {
                setJsonInput(JSON.stringify(data.questions || []));
                setExtractedQuestions(data.questions || []);
                setIsDocumentExtracted(true);
                Modal.success({
                    title: "Document Extracted",
                    content: "Your document has been successfully extracted.",
                });
            } else {
                throw new Error(data.message || "Failed to extract questions.");
            }
        } catch (error) {
            console.error("JSON extraction failed", error);
            Modal.error({
                title: "Extraction Failed",
                content:
                    error instanceof Error
                        ? error.message
                        : "Unable to extract questions.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePopulateQuestions = () => {
        if (!isDocumentExtracted) {
            message.error("No extracted data available to populate questions.");
            return;
        }

        try {
            const parsedQuestions = JSON.parse(jsonInput);

            const formattedQuestions = parsedQuestions.map((q: any) => ({
                question: q.question,
                description: q.description || "",
                options: q.options.map((option: string) => ({
                    value: option,
                    correct: false,
                })),
                correctOption: null,
            }));

            setExtractedQuestions(formattedQuestions);
            message.success("Questions populated successfully");
        } catch (error) {
            message.error("Invalid JSON format");
        }
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
    useEffect(() => {
        const fetchMasterCategories = async () => {
            const accessToken = localStorage.getItem("accessToken");
            try {
                const response = await fetch(
                    "https://examappbackend-0mts.onrender.com/api/v1/app/user/get-master-categories",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                const categories = data.data.master_categories;

                const items = categories.map((category, index) => ({
                    label: category.master_category,
                    key: index.toString(),
                }));

                setMasterCategoryItems(items);
            } catch (error) {
                console.error("Error fetching master categories:", error);
            }
        };

        fetchMasterCategories();
    }, []);

    const fetchExamCategories = async (masterCategory) => {
        const accessToken = localStorage.getItem("accessToken");
        try {
            const response = await fetch(
                "https://examappbackend-0mts.onrender.com/api/v1/app/user/get-exam-category",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        master_category: masterCategory,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setExamCategories(
                data.data.examCategories.map((category) => ({
                    label: category,
                    key: category,
                }))
            );
        } catch (error) {
            console.error("Error fetching exam categories:", error);
        }
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
            setLoading(true);
            try {
                let base64Image = image ? await getBase64(image) : null;
                let masterCatBase64Image = masterImage
                    ? await getBase64(masterImage)
                    : null;
                let examCatBase64Image = examCategoryImage
                    ? await getBase64(examCategoryImage)
                    : null;

                const durationInSeconds = timeValue
                    ? timeValue.hour() * 3600 + timeValue.minute() * 60
                    : 0;

                const payload = {
                    exam_name: examName,
                    exam_image: base64Image,
                    exam_category: selectedExamCategory,
                    master_category: selectedMasterCategory,
                    duration: durationInSeconds,
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
                    "https://examappbackend-0mts.onrender.com/api/v1/app/admin/add-exam",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify(payload),
                    }
                );
                const responseData = await response.json();
                if (responseData.statuscode !== 200) {
                    message.error(
                        "Failed to submit exam data: " + responseData.message
                    );
                    return;
                }

                if (masterCatBase64Image) {
                    const masterCategoryPayload = {
                        master_category: selectedMasterCategory,
                        image: masterCatBase64Image,
                    };
                    const masterCatImageUploadResponse = await fetch(
                        "https://examappbackend-0mts.onrender.com/api/v1/app/admin/add-master-category-image",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${accessToken}`,
                            },
                            body: JSON.stringify(masterCategoryPayload),
                        }
                    );
                    const masterCatData =
                        await masterCatImageUploadResponse.json();
                    if (masterCatData.statuscode !== 200) {
                        message.error(
                            "Failed to submit master category data: " +
                                masterCatData.message
                        );
                        return;
                    }
                }

                if (examCatBase64Image) {
                    const examCategoryPayload = {
                        exam_category: selectedExamCategory,
                        image: examCatBase64Image,
                    };
                    const examCatImageUploadResponse = await fetch(
                        "https://examappbackend-0mts.onrender.com/api/v1/app/admin/add-exam-category-image",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${accessToken}`,
                            },
                            body: JSON.stringify(examCategoryPayload),
                        }
                    );
                    const examCatData = await examCatImageUploadResponse.json();
                    if (examCatData.statuscode !== 200) {
                        message.error(
                            "Failed to submit exam category data: " +
                                examCatData.message
                        );
                        return;
                    }
                }

                message.success("All data submitted successfully!");
                setExamName("");
                setImage(null);
                setMasterImage(null);
                setExamCategoryImage(null);
                setQuestions([
                    {
                        question: "",
                        description: "",
                        options: [{ value: "", correct: false }],
                        correctOption: null,
                    },
                ]);
            } catch (error) {
                console.error("Error submitting exam data:", error);
                message.error("Error submitting exam data.");
            } finally {
                setLoading(false);
            }
        }
    };

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

    const handleExamImageUpload = (file) => {
        setImage(file);
        return false;
    };
    const handleMasterImageUpload = (file) => {
        setMasterImage(file);
        return false;
    };
    const handleExamCategoryImageUpload = (file) => {
        setExamCategoryImage(file);
        return false;
    };

    const handleRemoveImage = () => {
        setImage(null);
    };
    const handleRemoveMasterImage = () => {
        setMasterImage(null);
    };
    const handleRemoveExamCatImage = () => {
        setExamCategoryImage(null);
    };
    const onTimeChange = (time: Dayjs | null) => {
        if (time) {
            setTimeValue(time);
            message.success(`Time selected: ${time.format("HH:mm")}`);
        } else {
            setTimeValue(null);
        }
    };

    const handleCategorySelect = (key) => {
        const selectedCategory = masterCategoryItems.find(
            (item) => item.key === key
        );

        const masterCategory = selectedCategory ? selectedCategory.label : key;

        setSelectedMasterCategory(masterCategory);

        if (masterCategory) {
            fetchExamCategories(masterCategory);
        }
    };

    const handleExamCategorySelect = (key) => {
        const selectedExamCategory = examCategories.find(
            (item) => item.key === key
        );

        const examCategory = selectedExamCategory
            ? selectedExamCategory.label
            : key;

        setSelectedExamCategory(examCategory);

        if (examCategory) {
            fetchExamNames(examCategory);
        }
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
            {loading && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        zIndex: 1000,
                    }}
                >
                    <Spin size="large" />
                </div>
            )}
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
                                display: "flex",
                                flexDirection: "row",
                                width: "100%",
                                justifyContent: "space-between",
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

                            <button
                                style={{
                                    margin: "24px",
                                    padding: "10px 20px",
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    window.location.href =
                                        "/edit-test-questions";
                                }}
                            >
                                Edit Test Questions
                            </button>
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
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "40vh",
                                textAlign: "center",
                                padding: "20px",
                            }}
                        >
                            <h1
                                style={{
                                    marginBottom: "20px",
                                    fontSize: "4em",
                                }}
                            >
                                MCQ Extractor
                            </h1>

                            <p
                                style={{
                                    marginBottom: "20px",
                                    fontSize: "1.2em",
                                }}
                            >
                                Upload an image or PDF file to extract
                                multiple-choice questions.
                            </p>

                            <div
                                style={{
                                    marginBottom: "20px",
                                    position: "relative",
                                    display: "inline-block",
                                }}
                            >
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                    id="fileInput"
                                />
                                <label
                                    htmlFor="fileInput"
                                    style={{
                                        backgroundColor: selectedFile
                                            ? "black"
                                            : "#007bff",
                                        color: "white",
                                        padding: "10px 20px",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        fontSize: "1em",
                                    }}
                                >
                                    Browse Files
                                </label>

                                {selectedFile && (
                                    <p
                                        style={{
                                            marginTop: "10px",
                                            fontSize: "1em",
                                            color: "#333",
                                        }}
                                    >
                                        {selectedFile.name}
                                    </p>
                                )}
                            </div>

                            <Button
                                style={{
                                    marginTop: "24px",
                                    padding: "10px 20px",
                                    fontSize: "1em",
                                    marginRight: "10px",
                                }}
                                type="primary"
                                onClick={handleJsonExtraction}
                                disabled={!selectedFile}
                            >
                                Extract Questions
                            </Button>

                            <Button
                                style={{
                                    marginTop: "24px",
                                    padding: "10px 20px",
                                    fontSize: "1em",
                                }}
                                type="primary"
                                onClick={handlePopulateQuestions}
                                disabled={!isDocumentExtracted}
                            >
                                Populate Questions
                            </Button>
                        </div>

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
                                                flexDirection: "column",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    margin: "10px",
                                                }}
                                            >
                                                <Dropdown
                                                    menu={{
                                                        items: masterCategoryItems.map(
                                                            (item) => ({
                                                                key: item.key,
                                                                label: (
                                                                    <a
                                                                        onClick={() =>
                                                                            handleCategorySelect(
                                                                                item.key
                                                                            )
                                                                        }
                                                                    >
                                                                        {
                                                                            item.label
                                                                        }
                                                                    </a>
                                                                ),
                                                            })
                                                        ),
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
                                                                {selectedMasterCategory ||
                                                                    "Select Master Category"}
                                                                <DownOutlined />
                                                            </Button>
                                                        </Space>
                                                    </a>
                                                </Dropdown>

                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    <Input
                                                        placeholder="Enter Master Category"
                                                        onChange={(e) =>
                                                            handleCategorySelect(
                                                                e.target.value
                                                            )
                                                        }
                                                        style={{
                                                            width: "300px",
                                                        }}
                                                        onPressEnter={(e) =>
                                                            handleCategorySelect(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div
                                                style={{
                                                    margin: "10px",
                                                }}
                                            >
                                                <Dropdown
                                                    menu={{
                                                        items: examCategories.map(
                                                            (item) => ({
                                                                key: item.key,
                                                                label: (
                                                                    <a
                                                                        onClick={() =>
                                                                            handleExamCategorySelect(
                                                                                item.key
                                                                            )
                                                                        }
                                                                    >
                                                                        {
                                                                            item.label
                                                                        }
                                                                    </a>
                                                                ),
                                                            })
                                                        ),
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
                                                                {selectedExamCategory ||
                                                                    "Select Exam Category"}
                                                                <DownOutlined />
                                                            </Button>
                                                        </Space>
                                                    </a>
                                                </Dropdown>

                                                <div>
                                                    <Input
                                                        placeholder="Enter Exam Category"
                                                        onChange={(e) =>
                                                            handleExamCategorySelect(
                                                                e.target.value
                                                            )
                                                        }
                                                        style={{
                                                            width: "300px",
                                                            marginTop: "10px",
                                                        }}
                                                        onPressEnter={(e) =>
                                                            handleExamCategorySelect(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div style={{ margin: "10px" }}>
                                                <Input
                                                    placeholder="Exam name"
                                                    value={examName}
                                                    onChange={(e) =>
                                                        setExamName(
                                                            e.target.value
                                                        )
                                                    }
                                                    style={{ width: "300px" }}
                                                />
                                            </div>
                                            <div style={{ margin: "10px" }}>
                                                <TimePicker
                                                    value={timeValue}
                                                    onChange={onTimeChange}
                                                    format="HH:mm"
                                                    placeholder="Select duration"
                                                />
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                width: "100%",
                                                margin: "10px",
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
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        width: "100%",
                                        marginLeft: "80px",
                                    }}
                                >
                                    <Form.Item valuePropName="fileList">
                                        <Upload
                                            action="/upload.do"
                                            listType="picture-card"
                                            beforeUpload={handleExamImageUpload}
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
                                                        Upload Exam Image
                                                    </div>
                                                </button>
                                            )}
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item valuePropName="fileList">
                                        <Upload
                                            action="/upload.do"
                                            listType="picture-card"
                                            beforeUpload={
                                                handleMasterImageUpload
                                            }
                                            maxCount={1}
                                            onRemove={handleRemoveMasterImage}
                                            fileList={
                                                masterImage ? [masterImage] : []
                                            }
                                        >
                                            {!masterImage && (
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
                                                        Master Category Image
                                                    </div>
                                                </button>
                                            )}
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item valuePropName="fileList">
                                        <Upload
                                            action="/upload.do"
                                            listType="picture-card"
                                            beforeUpload={
                                                handleExamCategoryImageUpload
                                            }
                                            maxCount={1}
                                            onRemove={handleRemoveExamCatImage}
                                            fileList={
                                                examCategoryImage
                                                    ? [examCategoryImage]
                                                    : []
                                            }
                                        >
                                            {!examCategoryImage && (
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
                                                        Exam Category Image
                                                    </div>
                                                </button>
                                            )}
                                        </Upload>
                                    </Form.Item>
                                </div>
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

export default ExamQuestionScreen;
