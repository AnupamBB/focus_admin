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
    Modal,
} from "antd";
import "../styles.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const { Header, Content, Sider } = Layout;

const EditExamQuestion = () => {
    const navigate = useNavigate();
    const [selectedMasterCategory, setSelectedMasterCategory] = useState(
        "Select master category"
    );
    const [masterCategoryItems, setMasterCategoryItems] = useState([]);

    const [examCategories, setExamCategories] = useState([]);
    const [subjectExamNames, setSubjecExamNames] = useState([]);
    const [combinedExamNames, setCombinedSubjecExamNames] = useState([]);
    const [selectedExamName, setSelectedExamName] =
        useState("Select Exam Name");
    const [globalPositiveMark, setGlobalPositiveMark] = useState();
    const [globalNegativeMark, setGlobalNegativeMark] = useState();
    const [image, setImage] = useState(null);
    const [examId, setExamId] = useState("");
    const [timeValue, setTimeValue] = useState<Dayjs | null>(null);

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            if (!(file instanceof Blob)) {
                reject(new Error("Invalid file type"));
                return;
            }
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
                    body: JSON.stringify({ master_category: masterCategory }),
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setExamCategories(
                data.data.examCategories.map((category) => ({
                    label: category.exam_category,
                    key: category.exam_category,
                    image: category.exam_category_image,
                }))
            );
        } catch (error) {
            console.error("Error fetching exam categories:", error);
        }
    };

    const fetchExamNames = async (examCategory) => {
        const accessToken = localStorage.getItem("accessToken");
        try {
            const response = await fetch(
                "https://examappbackend-0mts.onrender.com/api/v1/app/admin/get-all-exams-under-exam-category",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ exam_category: examCategory }),
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setSubjecExamNames(
                data.data.subject_exams.map((exam) => ({
                    label: exam.exam_name,
                    key: exam.id,
                }))
            );
            setCombinedSubjecExamNames(
                data.data.combined_exams.map((exam) => ({
                    label: exam.exam_name,
                    key: exam.id,
                }))
            );
        } catch (error) {
            console.error("Error fetching exam names:", error);
        }
    };

    const handleCategorySelect = (key) => {
        const selectedCategory = masterCategoryItems.find(
            (item) => item.key === key
        );
        const masterCategory = selectedCategory
            ? selectedCategory.label
            : "Select master category";
        setSelectedMasterCategory(masterCategory);

        if (masterCategory !== "Select master category") {
            fetchExamCategories(masterCategory);
        }
    };
    const handleExamCategorySelect = (key) => {
        const selectedCategory = examCategories.find(
            (item) => item.key === key
        );
        const examCategory = selectedCategory
            ? selectedCategory.label
            : "Select exam category";
        setSelectedExamCategory(examCategory);

        if (examCategory !== "Select exam category") {
            fetchExamNames(examCategory);
        }
    };

    const handleExamMenuClick = async (examLabel) => {
        setSelectedExamName(examLabel);
        const accessToken = localStorage.getItem("accessToken");

        const selectedExam = subjectExamNames.find(
            (exam) => exam.label === examLabel
        );
        const selectedCombinedExam = combinedExamNames.find(
            (exam) => exam.label === examLabel
        );

        if (selectedExam) {
            try {
                const response = await fetch(
                    "https://examappbackend-0mts.onrender.com/api/v1/app/admin/get-exam-info",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify({ exam_id: selectedExam.key }),
                    }
                );

                if (response.ok) {
                    const result = await response.json();
                    const examData = result.data.exam;
                    setExamId(selectedExam.key);

                    if (examData.questions && examData.questions.length > 0) {
                        setGlobalPositiveMark(
                            examData.questions[0].positive_mark || 0
                        );
                        setGlobalNegativeMark(
                            examData.questions[0].negative_mark || 0
                        );
                    }

                    if (examData.exam_image) {
                        const imageData = examData.exam_image;
                        setImage({
                            uid: "-1",
                            name: `${examData.exam_name}.png`,
                            status: "done",
                            url: imageData,
                        });
                    }

                    setQuestions(
                        examData.questions.map((q) => ({
                            question: q.question_title,
                            options: q.options.map((option) => ({
                                value: option,
                            })),
                            correctOption: q.options.indexOf(q.correct_answer),
                            positiveMark: q.positive_mark,
                            negativeMark: q.negative_mark,
                        }))
                    );
                } else {
                    console.error("Failed to fetch exam info");
                }
            } catch (error) {
                console.error("Error fetching exam info:", error);
            }
        }
        if (selectedCombinedExam) {
            try {
                const response = await fetch(
                    "https://examappbackend-0mts.onrender.com/api/v1/app/admin/get-exam-info",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify({
                            exam_id: selectedCombinedExam.key,
                        }),
                    }
                );

                if (response.ok) {
                    const result = await response.json();
                    const examData = result.data.exam;
                    setExamId(selectedCombinedExam.key);

                    if (examData.questions && examData.questions.length > 0) {
                        setGlobalPositiveMark(
                            examData.questions[0].positive_mark || 0
                        );
                        setGlobalNegativeMark(
                            examData.questions[0].negative_mark || 0
                        );
                    }

                    if (examData.exam_image) {
                        const imageData = examData.exam_image;
                        setImage({
                            uid: "-1",
                            name: `${examData.exam_name}.png`,
                            status: "done",
                            url: imageData,
                        });
                    }

                    setQuestions(
                        examData.questions.map((q) => ({
                            question: q.question_title,
                            options: q.options.map((option) => ({
                                value: option,
                            })),
                            correctOption: q.options.indexOf(q.correct_answer),
                            positiveMark: q.positive_mark,
                            negativeMark: q.negative_mark,
                        }))
                    );
                } else {
                    console.error("Failed to fetch exam info");
                }
            } catch (error) {
                console.error("Error fetching exam info:", error);
            }
        }
    };

    const handleSubmitAll = async () => {
        let isValid = true;

        if (!selectedExamName.trim()) {
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
                if (image && (image instanceof Blob || image instanceof File)) {
                    base64Image = await getBase64(image);
                } else if (typeof image === "string") {
                    base64Image = image;
                }

                const durationInSeconds = timeValue
                    ? timeValue.hour() * 3600 + timeValue.minute() * 60
                    : 0;

                const payload = {
                    exam_id: examId,
                    exam_name: selectedExamName,
                    exam_image: base64Image,
                    exam_category: selectedExamCategory,
                    master_category: selectedMasterCategory,
                    duration: durationInSeconds,
                    questions: questions.map((q) => ({
                        question_title: q.question,
                        options: q.options.map((opt) => opt.value),
                        correct_answer: q.options[q.correctOption]?.value,
                        question_category: "Question Category",
                        positive_mark: Number(q.positiveMark),
                        negative_mark: Number(q.negativeMark),
                    })),
                };
                const accessToken = localStorage.getItem("accessToken");

                const response = await fetch(
                    "https://examappbackend-0mts.onrender.com/api/v1/app/admin/edit-exam",
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify(payload),
                    }
                );

                if (response.ok) {
                    message.success("All data submitted successfully!");
                } else {
                    const errorData = await response.json();
                    message.error(
                        `Failed to submit exam data: ${errorData.message}`
                    );
                }
            } catch (error) {
                console.error("Error submitting exam data:", error);
                message.error("Error submitting exam data.");
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

    const handleQuestionChange = (
        index: number,
        field: string,
        value: string | boolean | number
    ) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (
        questionIndex: number,
        optionIndex: number,
        value: string
    ) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex].value = value;
        setQuestions(updatedQuestions);
    };

    const handleCorrectOptionChange = (
        questionIndex: number,
        optionIndex: number
    ) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].correctOption = optionIndex;
        updatedQuestions[questionIndex].options.forEach((option, index) => {
            option.correct = index === optionIndex;
        });
        setQuestions(updatedQuestions);
    };
    const handleAddOption = (questionIndex: number) => {
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

    const handleDeleteExam = async () => {
        if (!examId) {
            message.error("No exam selected to delete.");
            return;
        }

        Modal.confirm({
            title: "Are you sure you want to delete this exam?",
            content: "This action cannot be undone.",
            okText: "Yes",
            cancelText: "Cancel",
            onOk: async () => {
                const accessToken = localStorage.getItem("accessToken");
                try {
                    const response = await fetch(
                        "https://examappbackend-0mts.onrender.com/api/v1/app/admin/delete_exam",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${accessToken}`,
                            },
                            body: JSON.stringify({ exam_id: examId }),
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Failed to delete exam");
                    }

                    message.success("Exam deleted successfully");
                    window.location.reload();
                } catch (error) {
                    console.error("Error deleting exam:", error);
                    message.error("Failed to delete exam");
                }
            },
        });
    };

    const handleDeleteQuestion = (questionIndex: number) => {
        if (questions.length > 1) {
            const updatedQuestions = questions.filter(
                (_, index) => index !== questionIndex
            );
            setQuestions(updatedQuestions);
        } else {
            message.error("At least one question is required.");
        }
    };

    const handleDeleteOption = (questionIndex: number, optionIndex: number) => {
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
    const onTimeChange = (time: Dayjs | null) => {
        if (time) {
            setTimeValue(time);
            message.success(`Time selected: ${time.format("HH:mm")}`);
        } else {
            setTimeValue(null);
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
        } else if (key === "7") {
            navigate("/EditExamCategories");
        } else if (key === "8") navigate("/ReuseSubject");
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
                    <Menu.Item key="7">Edit Categories</Menu.Item>
                    <Menu.Item key="8">Reuse Subjects</Menu.Item>
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
                            Edit Live Test Section
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
                                                                    {item.label}
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
                                                            key: item.key,
                                                            label: (
                                                                <a
                                                                    onClick={() =>
                                                                        handleExamCategorySelect(
                                                                            item.key
                                                                        )
                                                                    }
                                                                >
                                                                    {item.label}
                                                                </a>
                                                            ),
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
                                            <Dropdown
                                                menu={{
                                                    items: combinedExamNames.map(
                                                        (item) => ({
                                                            label: item.label,
                                                            key: item.key,
                                                            onClick: () =>
                                                                handleExamMenuClick(
                                                                    item.label
                                                                ),
                                                        })
                                                    ),
                                                }}
                                                trigger={["click"]}
                                                disabled={
                                                    selectedExamCategory ===
                                                    "Select exam category"
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
                                                                selectedExamCategory ===
                                                                "Select exam category"
                                                            }
                                                        >
                                                            {selectedExamName}{" "}
                                                            <DownOutlined />
                                                        </Button>
                                                    </Space>
                                                </a>
                                            </Dropdown>
                                            <Dropdown
                                                menu={{
                                                    items: subjectExamNames.map(
                                                        (item) => ({
                                                            label: item.label,
                                                            key: item.key,
                                                            onClick: () =>
                                                                handleExamMenuClick(
                                                                    item.label
                                                                ),
                                                        })
                                                    ),
                                                }}
                                                trigger={["click"]}
                                                disabled={
                                                    selectedExamCategory ===
                                                    "Select exam category"
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
                                                                selectedExamCategory ===
                                                                "Select exam category"
                                                            }
                                                        >
                                                            {selectedExamName}{" "}
                                                            <DownOutlined />
                                                        </Button>
                                                    </Space>
                                                </a>
                                            </Dropdown>
                                        </div>
                                        <div style={{ marginTop: "20px" }}>
                                            <TimePicker
                                                value={timeValue}
                                                onChange={onTimeChange}
                                                format="HH:mm"
                                                placeholder="Select duration"
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
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Button
                                type="primary"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={handleDeleteExam}
                                disabled={!examId}
                            >
                                Delete This Exam
                            </Button>
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
                                                <ReactQuill
                                                    placeholder="Your question goes here..."
                                                    value={question.question}
                                                    onChange={(value) =>
                                                        handleQuestionChange(
                                                            questionIndex,
                                                            "question",
                                                            value
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
