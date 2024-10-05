import React, { useState } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
    Layout,
    Menu,
    theme,
    Button,
    Upload,
    Input,
    Form,
    message,
} from "antd";
import "../styles.css";

const { Header, Content, Sider } = Layout;

const References = () => {
    const [references, setReferences] = useState([
        { title: "", link: "", image: [] },
    ]); // Array to store references
    const navigate = useNavigate();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const handleChange = (index, field, value) => {
        const updatedReferences = [...references];
        updatedReferences[index][field] = value;
        setReferences(updatedReferences);
    };

    const handleFileChange = (index, { fileList }) => {
        const updatedReferences = [...references];
        updatedReferences[index].image = fileList.slice(-1);
        setReferences(updatedReferences);
    };

    const handleSubmitAll = () => {
        console.log("All references submitted:", references);
        setReferences([{ title: "", link: "", image: [] }]);
        message.success("All notes submitted successfully");
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
                <Header style={{ background: colorBgContainer }}>
                    <div
                        style={{
                            textAlign: "center",
                            color: "black",
                            fontSize: 32,
                            fontWeight: "bold",
                        }}
                    >
                        Focus Admin Portal
                    </div>
                </Header>
                <Layout
                    style={{
                        padding: "24px 24px 24px",
                        flexDirection: "row",
                        gap: 24,
                    }}
                >
                    <Content
                        style={{
                            padding: 0,
                            margin: 0,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <div
                            style={{
                                color: "black",
                                fontSize: 24,
                                padding: "24px 24px 0",
                            }}
                        >
                            References Section
                        </div>
                        <hr
                            style={{
                                margin: "20px 0",
                                border: "none",
                                borderTop: "1px solid #e0e0e0",
                            }}
                        />

                        {references.map((reference, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    flexDirection: "row",
                                    marginBottom: "20px",
                                }}
                            >
                                <Form
                                    style={{
                                        width: "50%",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "20px",
                                        borderWidth: 1,
                                        justifyContent: "center",
                                        padding: 20,
                                        alignItems: "center",
                                    }}
                                >
                                    <div style={{ flex: 2 }}>
                                        <Form.Item
                                            label={`Enter Reference Title`}
                                            labelCol={{
                                                style: {
                                                    minWidth: "180px",
                                                    display: "flex",
                                                    alignItems: "start",
                                                },
                                            }}
                                        >
                                            <Input
                                                placeholder="Enter Reference Title"
                                                value={reference.title}
                                                onChange={(e) =>
                                                    handleChange(
                                                        index,
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                                style={{ minWidth: "400px" }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Enter Reference Link"
                                            labelCol={{
                                                style: {
                                                    minWidth: "180px",
                                                    display: "flex",
                                                    alignItems: "start",
                                                },
                                            }}
                                        >
                                            <Input
                                                placeholder="Enter Reference Link"
                                                value={reference.link}
                                                onChange={(e) =>
                                                    handleChange(
                                                        index,
                                                        "link",
                                                        e.target.value
                                                    )
                                                }
                                                style={{ minWidth: "400px" }}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            height: 200,
                                            minWidth: "580px",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            border: "2px dashed #d9d9d9",
                                            background: "none",
                                            width: "150px",
                                            flexDirection: "column",
                                            borderRadius: "8px",
                                        }}
                                    >
                                        <Form.Item
                                            valuePropName="fileList"
                                            getValueFromEvent={normFile}
                                        >
                                            <Upload
                                                action="/upload.do"
                                                listType="picture-card"
                                                fileList={reference.image}
                                                onChange={(file) =>
                                                    handleFileChange(
                                                        index,
                                                        file
                                                    )
                                                }
                                                maxCount={1}
                                            >
                                                {reference.image.length < 1 && (
                                                    <button type="button">
                                                        <PlusOutlined />
                                                        <div>Upload Image</div>
                                                    </button>
                                                )}
                                            </Upload>
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
                                onClick={handleSubmitAll}
                                style={{ width: "100%" }}
                            >
                                Submit Reference
                            </Button>
                        </Form.Item>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default References;
