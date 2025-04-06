import { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Layout, message, Menu, Button, Form, Dropdown, Space } from "antd";
import "../styles.css";
import "react-quill/dist/quill.snow.css";

const { Header, Content, Sider } = Layout;

const ReuseSubject = () => {
    const navigate = useNavigate();
    const [selectedMasterCategory, setSelectedMasterCategory] = useState(
        "Select from Master Category"
    );
    const [selectedToMasterCategory, setSelectedToMasterCategory] = useState(
        "Select to Master Category"
    );
    const [masterCategoryItems, setMasterCategoryItems] = useState([]);
    const [toMasterCategoryItems, setToMasterCategoryItems] = useState([]);
    const [examCategories, setExamCategories] = useState([]);
    const [toExamCategories, setToExamCategories] = useState([]);
    const [examSubjectsNames, setSubjectsNames] = useState([]);
    const [selectedExamName, setSelectedExamName] =
        useState("Select exam name");
    const [selectedExamSubjectName, setSelectedExamSubjectName] = useState(
        "Select exam subject name"
    );
    const [selectedExamCategory, setSelectedExamCategory] = useState(
        "Select from Exam Category"
    );
    const [selectedToExamCategory, setSelectedToExamCategory] = useState(
        "Select to Exam Category"
    );
    const [newMasterCategory, setNewMasterCategory] = useState("");
    const [newExamCategory, setNewExamCategory] = useState("");
    const [newExamSubjectName, setNewSubjectName] = useState("");
    const [newName, setNewName] = useState("");

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

    const fetchSubjectsNames = async (examCategory) => {
        const accessToken = localStorage.getItem("accessToken");
        try {
            const response = await fetch(
                "https://examappbackend-0mts.onrender.com/api/v1/app/admin/get-subject-names",
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

            setSubjectsNames(
                data.data.map((subject, index) => ({
                    label: subject,
                    key: index,
                }))
            );
        } catch (error) {
            console.error("Error fetching exam names:", error);
        }
    };

    const fetchToMasterCategories = async () => {
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

            setToMasterCategoryItems(items);
        } catch (error) {
            console.error("Error fetching master categories:", error);
        }
    };

    const fetchToExamCategories = async (masterCategory) => {
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
            setToExamCategories(
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

    const handleCategorySelect = (key) => {
        const selectedCategory = masterCategoryItems.find(
            (item) => item.key === key
        );
        const masterCategory = selectedCategory
            ? selectedCategory.label
            : "Select from Master Category";
        setSelectedMasterCategory(masterCategory);

        if (masterCategory !== "Select from Master Category") {
            fetchExamCategories(masterCategory);
        }
    };

    const handleExamCategorySelect = (key) => {
        const selectedCategory = examCategories.find(
            (item) => item.key === key
        );
        const examCategory = selectedCategory
            ? selectedCategory.label
            : "Select from Exam Category";
        setSelectedExamCategory(examCategory);

        if (examCategory !== "Select from Exam Category") {
            fetchSubjectsNames(examCategory); // Fetch subjects separately
        }
    };

    const handleExamSubjectSelect = (key) => {
        const selectedExamName = examSubjectsNames.find(
            (item) => item.key === key
        );
        const examSubject = selectedExamName
            ? selectedExamName.label
            : "Select from Exam Category";
        setSelectedExamSubjectName(examSubject);
        fetchToMasterCategories();
    };

    const handleToCategorySelect = (key) => {
        const selectedCategory = toMasterCategoryItems.find(
            (item) => item.key === key
        );
        const masterCategory = selectedCategory
            ? selectedCategory.label
            : "Select to Master Category";
        setSelectedToMasterCategory(masterCategory);

        if (masterCategory !== "Select to Master Category") {
            fetchToExamCategories(masterCategory);
        }
    };
    const handleToExamCategorySelect = (key) => {
        const selectedCategory = toExamCategories.find(
            (item) => item.key === key
        );
        const examCategory = selectedCategory
            ? selectedCategory.label
            : "Select to Exam Category";
        setSelectedToExamCategory(examCategory);
    };

    const handleSubmitAll = async () => {
        const accessToken = localStorage.getItem("accessToken");

        if (
            selectedMasterCategory === "Select from Master Category" ||
            selectedExamCategory === "Select from Exam Category" ||
            selectedExamSubjectName === "Select exam subject name" ||
            selectedToMasterCategory === "Select to Master Category" ||
            selectedToExamCategory === "Select to Exam Category"
        ) {
            message.warning("Please make all selections before submitting.");
            return;
        }

        const payload = {
            from_master_category: selectedMasterCategory,
            from_exam_category: selectedExamCategory,
            from_subject_name: selectedExamSubjectName,
            to_master_category: selectedToMasterCategory,
            to_exam_category: selectedToExamCategory,
        };

        try {
            const response = await fetch(
                "https://examappbackend-0mts.onrender.com/api/v1/app/admin/clone-subject",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            message.success("Subject cloned successfully!");
            console.log("Clone success:", result);
        } catch (error) {
            console.error("Error submitting data:", error);
            message.error("Failed to submit data.");
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
                            Edit Categories
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
                                                width: "100%",
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
                                                                        {
                                                                            item.label
                                                                        }
                                                                    </a>
                                                                ),
                                                            })
                                                        ),
                                                    }}
                                                    trigger={["click"]}
                                                    disabled={
                                                        selectedMasterCategory ===
                                                        "Select from Master Category"
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
                                                                    "Select from Master Category"
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
                                                        items: examSubjectsNames.map(
                                                            (item) => ({
                                                                key: item.key,
                                                                label: (
                                                                    <a
                                                                        onClick={() =>
                                                                            handleExamSubjectSelect(
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
                                                    disabled={
                                                        selectedExamCategory ===
                                                        "Select from Exam Category"
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
                                                                    "Select from Exam Category"
                                                                }
                                                            >
                                                                {
                                                                    selectedExamSubjectName
                                                                }{" "}
                                                                <DownOutlined />
                                                            </Button>
                                                        </Space>
                                                    </a>
                                                </Dropdown>
                                            </div>
                                            <div
                                                style={{
                                                    margin: "16px",
                                                    width: "100%",
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-around",
                                                }}
                                            >
                                                <Dropdown
                                                    menu={{
                                                        items: toMasterCategoryItems.map(
                                                            (item) => ({
                                                                key: item.key,
                                                                label: (
                                                                    <a
                                                                        onClick={() =>
                                                                            handleToCategorySelect(
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
                                                    disabled={
                                                        selectedExamSubjectName ===
                                                        "Select exam subject name"
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
                                                                    selectedExamSubjectName ===
                                                                    "Select exam subject name"
                                                                }
                                                            >
                                                                {
                                                                    selectedToMasterCategory
                                                                }
                                                                <DownOutlined />
                                                            </Button>
                                                        </Space>
                                                    </a>
                                                </Dropdown>
                                                <Dropdown
                                                    menu={{
                                                        items: toExamCategories.map(
                                                            (item) => ({
                                                                key: item.key,
                                                                label: (
                                                                    <a
                                                                        onClick={() =>
                                                                            handleToExamCategorySelect(
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
                                                    disabled={
                                                        selectedToMasterCategory ===
                                                        "Select to Master Category"
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
                                                                    selectedToMasterCategory ===
                                                                    "Select to Master Category"
                                                                }
                                                            >
                                                                {
                                                                    selectedToExamCategory
                                                                }
                                                                <DownOutlined />
                                                            </Button>
                                                        </Space>
                                                    </a>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </Form.Item>
                                </div>
                            </Form>
                        </div>

                        <Form.Item
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
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

export default ReuseSubject;
