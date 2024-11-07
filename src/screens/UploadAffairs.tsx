import React, { useState } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
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
    message,
} from "antd";
import "./styles.css";
import TextArea from "antd/es/input/TextArea";

const { Header, Content, Sider } = Layout;

const UploadAffairs = () => {
    const navigate = useNavigate();
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

    const handleSelectChange = (index, value) => {
        const updatedAffairs = [...affairs];
        if (value === "add_new") {
            updatedAffairs[index].showInput = true;
            updatedAffairs[index].selectDisabled = true;
        } else {
            updatedAffairs[index].category = value;
        }
        setAffairs(updatedAffairs);
    };

    const handleSaveNewOption = (index) => {
        const updatedAffairs = [...affairs];
        const newClassification = updatedAffairs[index].newOptionValue;

        if (newClassification) {
            const newOptions = [
                ...options,
                {
                    value: newClassification.toLowerCase(),
                    label: newClassification,
                },
            ];
            setOptions(newOptions);

            updatedAffairs[index].category = newClassification.toLowerCase();
            updatedAffairs[index].showInput = false;
            updatedAffairs[index].selectDisabled = false;
            updatedAffairs[index].newOptionValue = "";
            setAffairs(updatedAffairs);
        }
    };

    const handleCancel = (index) => {
        const updatedAffairs = [...affairs];
        updatedAffairs[index].newOptionValue = "";
        updatedAffairs[index].showInput = false;
        updatedAffairs[index].selectDisabled = false;
        setAffairs(updatedAffairs);
    };

    const handleChange = (index, field, value) => {
        const updatedAffairs = [...affairs];
        updatedAffairs[index][field] = value;
        setAffairs(updatedAffairs);
    };

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

    const handleSubmitAll = async () => {
        const affairsToSubmit = [];

        for (const affair of affairs) {
            const {
                title,
                description,
                date_of_event,
                category,
                currentAffImg,
            } = affair;

            const imgBase64 =
                currentAffImg.length > 0
                    ? await convertToBase64(currentAffImg[0].originFileObj)
                    : "";

            affairsToSubmit.push({
                action: "create",
                title: title,
                currentAffImg: imgBase64,
                description: description,
                date_of_event: date_of_event?.format("YYYY-MM-DD"),
                category: category,
            });
        }

        try {
            const accessToken = localStorage.getItem("accessToken");

            const response = await fetch(
                "https://examappbackend-0mts.onrender.com/api/v1/app/admin/current-affairs",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(affairsToSubmit[0]),
                }
            );

            if (response.ok) {
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
                message.success("All affairs submitted successfully");
            } else {
                message.error("Failed to submit affairs");
            }
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
                                Current Affairs Section
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
                                        "/edit-current-affairs";
                                }}
                            >
                                Edit current affairs
                            </button>
                        </div>
                        <hr
                            style={{
                                margin: "20px 0",
                                border: "none",
                                borderTop: "1px solid #e0e0e0",
                            }}
                        />

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
                                                value={affair.date_of_event}
                                                onChange={(date_of_event) =>
                                                    handleChange(
                                                        index,
                                                        "date_of_event",
                                                        date_of_event
                                                    )
                                                }
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
                                                value={affair.category}
                                                onChange={(value) =>
                                                    handleSelectChange(
                                                        index,
                                                        value
                                                    )
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

                                            {affair.showInput && (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "10px",
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    <Input
                                                        value={
                                                            affair.newOptionValue
                                                        }
                                                        onChange={(e) => {
                                                            handleChange(
                                                                index,
                                                                "newOptionValue",
                                                                e.target.value
                                                            );
                                                        }}
                                                        placeholder="New category"
                                                    />
                                                    <Button
                                                        onClick={() =>
                                                            handleSaveNewOption(
                                                                index
                                                            )
                                                        }
                                                        type="primary"
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        onClick={() =>
                                                            handleCancel(index)
                                                        }
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            )}
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
                                                value={affair.title}
                                                onChange={(e) =>
                                                    handleChange(
                                                        index,
                                                        "title",
                                                        e.target.value
                                                    )
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
                                                value={affair.description}
                                                onChange={(e) =>
                                                    handleChange(
                                                        index,
                                                        "description",
                                                        e.target.value
                                                    )
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

export default UploadAffairs;
