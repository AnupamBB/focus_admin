import { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
    Layout,
    message,
    Menu,
    Button,
    Form,
    Input,
    Dropdown,
    Space,
} from "antd";
import "../styles.css";
import "react-quill/dist/quill.snow.css";

const { Header, Content, Sider } = Layout;

const EditExamCategories = () => {
    const navigate = useNavigate();
    const [selectedMasterCategory, setSelectedMasterCategory] = useState(
        "Select master category"
    );
    const [masterCategoryItems, setMasterCategoryItems] = useState([]);

    const [examCategories, setExamCategories] = useState([]);
    const [examNames, setExamNames] = useState([]);
    const [selectedExamName, setSelectedExamName] =
        useState("Select exam name");
    const [newMasterCategory, setNewMasterCategory] = useState("");
    const [newExamCategory, setNewExamCategory] = useState("");
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
            setExamNames(
                data.data.map((exam) => ({
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

    const handleSubmitAll = async () => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("Access token not found");
            message.error("Access token not found. Please log in again.");
            return;
        }

        try {
            let apiUrl = "";
            let requestBody = {};

            if (
                selectedMasterCategory !== "Select master category" &&
                selectedExamCategory === "Select exam category" &&
                selectedExamName === "Select exam name"
            ) {
                if (
                    !selectedMasterCategory.trim() ||
                    !newMasterCategory.trim()
                ) {
                    message.warning(
                        "Old and new master category names cannot be empty."
                    );
                    return;
                }

                apiUrl =
                    "https://examappbackend-0mts.onrender.com/api/v1/app/admin/edit-master-category";
                requestBody = {
                    old_name: selectedMasterCategory,
                    new_name: newMasterCategory,
                };
            } else if (
                selectedMasterCategory !== "Select master category" &&
                selectedExamCategory !== "Select exam category" &&
                selectedExamName === "Select exam name"
            ) {
                if (!selectedExamCategory.trim() || !newExamCategory.trim()) {
                    message.warning(
                        "Old and new exam category names cannot be empty."
                    );
                    return;
                }

                apiUrl =
                    "https://examappbackend-0mts.onrender.com/api/v1/app/admin/edit-exam-category";
                requestBody = {
                    master_category: selectedMasterCategory,
                    old_name: selectedExamCategory,
                    new_name: newExamCategory,
                };
            } else if (
                selectedMasterCategory !== "Select master category" &&
                selectedExamCategory !== "Select exam category" &&
                selectedExamName !== "Select exam name"
            ) {
                if (!selectedExamName.trim() || !newName.trim()) {
                    message.warning("Old and new exam names cannot be empty.");
                    return;
                }

                apiUrl =
                    "https://examappbackend-0mts.onrender.com/api/v1/app/admin/edit-exam-name";
                requestBody = {
                    master_category: selectedMasterCategory,
                    exam_category: selectedExamCategory,
                    old_name: selectedExamName,
                    new_name: newName,
                };
            } else {
                message.warning("Please select at least a master category.");
                return;
            }

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("API Response:", data);

            if (data.data.result.modifiedCount > 0) {
                message.success(data.message || "Changes saved successfully!");

                // Clear fields
                setSelectedMasterCategory("Select master category");
                setSelectedExamCategory("Select exam category");
                setSelectedExamName("Select exam name");
                setNewMasterCategory("");
                setNewExamCategory("");
                setNewName("");

                // Reload the page
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                message.info("No changes were made.");
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            message.error("Failed to submit data.");
        }
    };

    const [selectedExamCategory, setSelectedExamCategory] = useState(
        "Select exam category"
    );

    const handleExamMenuClick = async (examLabel) => {
        setSelectedExamName(examLabel);
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
        } else if (key === "7") navigate("/EditExamCategories");
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
                                                        items: examNames.map(
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
                                                                {
                                                                    selectedExamName
                                                                }{" "}
                                                                <DownOutlined />
                                                            </Button>
                                                        </Space>
                                                    </a>
                                                </Dropdown>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    <Input
                                                        placeholder="Enter New Master Category"
                                                        style={{
                                                            width: "300px",
                                                        }}
                                                        value={
                                                            newMasterCategory
                                                        }
                                                        onChange={(e) =>
                                                            setNewMasterCategory(
                                                                e.target.value
                                                            )
                                                        }
                                                        disabled={
                                                            selectedExamCategory !==
                                                            "Select exam category"
                                                        }
                                                    />
                                                </div>

                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    <Input
                                                        placeholder="Enter New Exam Category"
                                                        style={{
                                                            width: "300px",
                                                        }}
                                                        value={newExamCategory}
                                                        onChange={(e) =>
                                                            setNewExamCategory(
                                                                e.target.value
                                                            )
                                                        }
                                                        disabled={
                                                            selectedExamCategory ===
                                                                "Select exam category" ||
                                                            selectedMasterCategory ===
                                                                "Select master category" ||
                                                            selectedExamName !==
                                                                "Select exam name"
                                                        }
                                                    />
                                                </div>

                                                <div
                                                    style={{
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    <Input
                                                        placeholder="Enter New Name"
                                                        style={{
                                                            width: "300px",
                                                        }}
                                                        value={newName}
                                                        onChange={(e) =>
                                                            setNewName(
                                                                e.target.value
                                                            )
                                                        }
                                                        disabled={
                                                            selectedExamName ===
                                                            "Select exam name"
                                                        }
                                                    />
                                                </div>
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

export default EditExamCategories;
