import { useEffect, useState } from "react";
import { InboxOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
    Layout,
    Menu,
    Button,
    Form,
    Input,
    message,
    Dropdown,
    Space,
    Upload,
} from "antd";
import "../styles.css";
const { Dragger } = Upload;
const { Header, Content, Sider } = Layout;

const EditNotes = () => {
    const [fileBase64, setFileBase64] = useState("");
    const navigate = useNavigate();
    const [selectedMasterCategory, setSelectedMasterCategory] = useState(
        "Select master category"
    );
    const [masterCategoryItems, setMasterCategoryItems] = useState([]);
    const [examCategories, setExamCategories] = useState([]);
    const [examNames, setExamNames] = useState([]);
    const [materialTitle, setMaterialTitle] = useState("");
    const [id, setId] = useState("");
    const [selectedExamName, setSelectedExamName] = useState("Select material");
    const [selectedExamCategory, setSelectedExamCategory] = useState(
        "Select exam category"
    );

    const handleExamMenuClick = (label, key) => {
        const selectedNote = examNames.find((item) => item.label === label);

        console.log(examNames);
        if (selectedNote) {
            setMaterialTitle(selectedNote.label);
            setId(selectedNote.key);
            const byteCharacters = atob(selectedNote.content.split(",")[1]);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([byteNumbers], { type: "application/pdf" });
            const file = new File([blob], `${selectedNote.label}.pdf`, {
                type: "application/pdf",
            });
            setSelectedExamName(selectedNote.label);
        }
    };
    const handleFileChange = (info) => {
        const file = info.file;
        if (!file || !(file instanceof Blob)) {
            message.error(
                "Failed to read the file. Please make sure to upload a valid file."
            );
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;
            setFileBase64(base64);
            console.log("Base64:", base64);
        };
        reader.readAsDataURL(file);
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

    const fetchStudyMaterials = async (examCategory) => {
        const accessToken = localStorage.getItem("accessToken");
        try {
            const response = await fetch(
                "https://examappbackend-0mts.onrender.com/api/v1/app/user/manipulate-materials",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        exam_category: examCategory,
                        action: "read",
                        material_type: "study_materials",
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setExamNames(
                data.data.material.study_materials.map((material) => ({
                    label: material.title,
                    key: material._id,
                }))
            );
        } catch (error) {
            console.error("Error fetching study materials:", error);
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
            fetchStudyMaterials(examCategory);
        }
    };

    const handleSubmitAll = async () => {
        console.log("materialTitle     ", materialTitle);
        console.log("base     ", fileBase64);
        if (!materialTitle || !fileBase64) {
            message.error("Please fill in all the fields before submitting.");
            return;
        }

        const accessToken = localStorage.getItem("accessToken");
        const payload = {
            action: "update",
            exam_category: selectedExamCategory,
            material_type: "study_materials",
            material_object_id: id,
            updateField: {
                title: materialTitle,
                content: fileBase64,
            },
        };
        console.log("payload", payload);

        try {
            const response = await fetch(
                "https://examappbackend-0mts.onrender.com/api/v1/app/user/manipulate-materials",
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
                message.success("File uploaded successfully!");
            } else {
                const errorData = await response.json();
                message.error(`Upload failed: ${errorData.message}`);
            }
        } catch (error) {
            message.error("An error occurred while uploading the file.");
            console.error("Upload error:", error);
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
                            Edit Notes Section
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
                                                            {selectedExamName}{" "}
                                                            <DownOutlined />
                                                        </Button>
                                                    </Space>
                                                </a>
                                            </Dropdown>
                                        </div>
                                    </Form.Item>
                                    <Form.Item
                                        label={`Enter Title`}
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                    >
                                        <Input
                                            placeholder="Enter Title"
                                            value={materialTitle}
                                            onChange={(e) =>
                                                setMaterialTitle(e.target.value)
                                            }
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>

                                    <Form.Item>
                                        <Dragger
                                            beforeUpload={() => false}
                                            maxCount={1}
                                            onChange={handleFileChange}
                                        >
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">
                                                Click or drag file to this area
                                                to upload Notes
                                            </p>
                                            <p className="ant-upload-hint">
                                                Support for a single file at a
                                                time
                                            </p>
                                        </Dragger>
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
                                Submit
                            </Button>
                        </Form.Item>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default EditNotes;
