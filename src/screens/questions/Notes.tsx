import { useState } from "react";
import {InboxOutlined,} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {Layout, Menu, theme, Button, Upload, message, Form, Input} from "antd";
import "../styles.css";

const { Header, Content, Sider } = Layout;
const { Dragger } = Upload;

const Notes = () => {
    const [notes, setNotes] = useState([{ title: "", pdfFile: [] }]);
    const navigate = useNavigate();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleChange = (index: number,field: string,value: string | number | boolean) => {
        const updatedNotes = [...notes];
        updatedNotes[index][field] = value;
        setNotes(updatedNotes);
    };

    const handleFileChange = (index, { fileList }) => {
        const updatedNotes = [...notes];
        updatedNotes[index].pdfFile = fileList.slice(-1);
        setNotes(updatedNotes);
    };

    const handleSubmitAll = () => {
        console.log("All notes submitted:", notes);
        setNotes([{ title: "", pdfFile: [] }]);
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

    const uploadProps = {
        name: "file",
        multiple: true,
        action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
        onChange(info) {
            const { status } = info.file;
            if (status !== "uploading") {
                console.log(info.file, info.fileList);
            }
            if (status === "done") {
                message.success(
                    `${info.file.name} file uploaded successfully.`
                );
            } else if (status === "error") {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log("Dropped files", e.dataTransfer.files);
        },
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
                        BidYa Admin Portal
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
                            Notes Section
                        </div>
                        <hr
                            style={{
                                margin: "20px 0",
                                border: "none",
                                borderTop: "1px solid #e0e0e0",
                            }}
                        />

                        {notes.map((note, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
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
                                        padding: 20,
                                        justifyContent: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            flex: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <Form.Item
                                            label={`Enter Title`}
                                            labelCol={{ span: 24 }}
                                            wrapperCol={{ span: 24 }}
                                        >
                                            <Input
                                                placeholder="Enter Title"
                                                value={note.title}
                                                onChange={(e) =>
                                                    handleChange(
                                                        index,
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>
                                    </div>

                                    <div>
                                        <Form.Item>
                                            <Dragger
                                                {...uploadProps}
                                                fileList={note.pdfFile}
                                                beforeUpload={() => false}
                                                onChange={(file) =>
                                                    handleFileChange(
                                                        index,
                                                        file
                                                    )
                                                }
                                                maxCount={1}
                                            >
                                                <p className="ant-upload-drag-icon">
                                                    <InboxOutlined />
                                                </p>
                                                <p className="ant-upload-text">
                                                    Click or drag file to this
                                                    area to upload Notes
                                                </p>
                                                <p className="ant-upload-hint">
                                                    Support for a single at a time
                                                </p>
                                            </Dragger>
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
                                Submit Paper
                            </Button>
                        </Form.Item>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default Notes;
