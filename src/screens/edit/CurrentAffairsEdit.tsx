import { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
    Layout,
    Menu,
    Button,
    DatePicker,
    Form,
    Input,
    Upload,
    Select,
    Dropdown,
    Space,
    message,
} from "antd";
import "../styles.css";
import TextArea from "antd/es/input/TextArea";
import { DownOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Header, Content, Sider } = Layout;

const EditAffairs = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("Select a Title");
    const [date, setDate] = useState(null);
    const [des, setDes] = useState(null);
    const [cat, setCat] = useState(null);
    const [selectedAffairId, setSelectedAffairId] = useState(null);

    const [currentAffairsItems, setCurrentAffairsItems] = useState([]);

    const [options, setOptions] = useState([
        { value: "world", label: "World" },
        { value: "india", label: "India" },
        { value: "Environment", label: "Environment" },
        { value: "assam", label: "Assam" },
    ]);

    const [affairs, setAffairs] = useState([
        {
            date_of_event: null,
            category: "",
            title: "",
            description: "",
            currentAffImg: [],
            showInput: false,
            newOptionValue: "",
            selectDisabled: false,
        },
    ]);

    const handleFileChange = (index, { fileList }) => {
        const updatedAffairs = [...affairs];
        updatedAffairs[index].currentAffImg = fileList.slice(-1);
        setAffairs(updatedAffairs);
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    useEffect(() => {
        const fetchCurrentAffairs = async () => {
            const accessToken = localStorage.getItem("accessToken");
            try {
                const response = await fetch(
                    "https://examappbackend-0mts.onrender.com/api/v1/app/admin/current-affairs",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify({
                            action: "get",
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                console.log(data);
                const currentAffairs = data.data.currentAffairs;

                const items = currentAffairs.map((affair) => ({
                    label: affair.title,
                    key: affair._id,
                    details: affair,
                }));

                setCurrentAffairsItems(items);
            } catch (error) {
                console.error("Error fetching current affairs:", error);
            }
        };

        fetchCurrentAffairs();
    }, []);

    const handleAffairSelect = (key) => {
        const selected = currentAffairsItems.find((item) => item.key === key);
        if (selected) {
            setTitle(selected.details.title);
            setCat(selected.details.category);
            setDate(selected.details.date_of_event);
            setDes(selected.details.description);
            setSelectedAffairId(selected.details._id);
        }
    };

    const handleSubmitAll = async () => {
        try {
            if (affairs.length === 0) {
                message.error("No affairs to submit");
                return;
            }

            if (!selectedAffairId || !title || !des || !date || !cat) {
                message.error("Please fill in all required fields");
                return;
            }

            const currentAffImg = affairs[0].currentAffImg;
            const imgBase64 =
                currentAffImg.length > 0
                    ? await convertToBase64(currentAffImg[0].originFileObj)
                    : "";

            const payload = {
                action: "update",
                id: selectedAffairId,
                title: title,
                currentAffImg: imgBase64,
                description: des,
                date_of_event: date,
                category: cat,
            };

            const accessToken = localStorage.getItem("accessToken");

            const response = await fetch(
                "https://examappbackend-0mts.onrender.com/api/v1/app/admin/current-affairs",
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
                throw new Error("Failed to submit affair");
            }

            setAffairs([
                {
                    date_of_event: null,
                    category: "",
                    title: "",
                    description: "",
                    currentAffImg: [],
                    showInput: false,
                    newOptionValue: "",
                    selectDisabled: false,
                },
            ]);
            message.success("Affair submitted successfully");
        } catch (error) {
            console.error("Error submitting affairs:", error);
            message.error("An error occurred while submitting affairs");
        }
    };

    const onMenuClick = ({ key }) => {
        if (key === "2") navigate("/live-test-questions");
        else if (key === "3") navigate("/question-papers");
        else if (key === "4") navigate("/notes");
        else if (key === "5") navigate("/references");
        else if (key === "6") navigate("/upload-current-affairs");
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
                                display: "flex",
                                width: "100%",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    color: "black",
                                    fontSize: 24,
                                    padding: "24px 24px 0",
                                }}
                            >
                                Edit Current Affairs Section
                            </div>
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
                                minWidth: "16vw",
                            }}
                        >
                            <Dropdown
                                menu={{
                                    items: currentAffairsItems.map((item) => ({
                                        key: item.key,
                                        label: (
                                            <a
                                                onClick={() =>
                                                    handleAffairSelect(item.key)
                                                }
                                            >
                                                {item.label}
                                            </a>
                                        ),
                                    })),
                                }}
                                trigger={["click"]}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <Button>
                                            {title}
                                            <DownOutlined />
                                        </Button>
                                    </Space>
                                </a>
                            </Dropdown>
                        </div>
                        {affairs.map((affair, index) => (
                            <div
                                key={index}
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
                                        minWidth: "34vw",
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
                                            label={`Date_of_event`}
                                            labelCol={{
                                                style: {
                                                    display: "flex",
                                                    width: "140px",
                                                    alignItems: "start",
                                                },
                                            }}
                                        >
                                            <DatePicker
                                                style={{ width: "360px" }}
                                                value={
                                                    date ? dayjs(date) : null
                                                }
                                                onChange={(dateValue) => {
                                                    setDate(
                                                        dateValue
                                                            ? dayjs(
                                                                  dateValue
                                                              ).format(
                                                                  "YYYY-MM-DD"
                                                              )
                                                            : null
                                                    );
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Select category"
                                            labelCol={{
                                                style: {
                                                    display: "flex",
                                                    width: "140px",
                                                    alignItems: "start",
                                                },
                                            }}
                                        >
                                            <Select
                                                style={{ width: "360px" }}
                                                value={cat}
                                                onChange={(value) =>
                                                    setCat(value)
                                                }
                                            >
                                                {options.map((option) => (
                                                    <Select.Option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </Select.Option>
                                                ))}
                                                <Select.Option value="add_new">
                                                    Add New Option
                                                </Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            label="Title"
                                            labelCol={{
                                                style: {
                                                    display: "flex",
                                                    width: "140px",
                                                    alignItems: "start",
                                                },
                                            }}
                                        >
                                            <Input
                                                style={{ width: "360px" }}
                                                value={title}
                                                onChange={(e) =>
                                                    setTitle(e.target.value)
                                                }
                                                placeholder="Title"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="Description"
                                            labelCol={{
                                                style: {
                                                    display: "flex",
                                                    width: "140px",
                                                    alignItems: "start",
                                                },
                                            }}
                                        >
                                            <TextArea
                                                style={{ width: "360px" }}
                                                value={des}
                                                onChange={(e) =>
                                                    setDes(e.target.value)
                                                }
                                                rows={4}
                                                placeholder="Description"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Upload Image"
                                            labelCol={{
                                                style: {
                                                    display: "flex",
                                                    width: "140px",
                                                    alignItems: "start",
                                                    color: "black",
                                                },
                                            }}
                                        >
                                            <Upload
                                                accept=".png,.jpg,.jpeg"
                                                fileList={affair.currentAffImg}
                                                onChange={(info) =>
                                                    handleFileChange(
                                                        index,
                                                        info
                                                    )
                                                }
                                                beforeUpload={() => false}
                                                maxCount={1}
                                            >
                                                <Button icon={<PlusOutlined />}>
                                                    Upload
                                                </Button>
                                            </Upload>
                                        </Form.Item>
                                    </div>
                                </Form>
                            </div>
                        ))}

                        <div
                            style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "center",
                            }}
                        >
                            <Button
                                type="primary"
                                onClick={handleSubmitAll}
                                style={{ marginBottom: 20 }}
                            >
                                Submit current affair
                            </Button>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default EditAffairs;
