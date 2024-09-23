import {DatePicker, Input, Button, Upload} from 'antd';
import {UploadOutlined, CalendarOutlined} from '@ant-design/icons';
import React from 'react';
import './styles.css';
import {useNavigate} from "react-router-dom";
export default function UploadFile() {
	const navigate = useNavigate();

	const handleQues = () => {
		navigate('/ExamQuestionScreen');
	};
	return (
		<div className="current-affairs-container">
			<header className="current-affairs-header">
				<h1 className="text-4xl font-bold">BidYa Admin Panel</h1>
			</header>

			<main className="current-affairs-main">
				<div className="current-affairs-form">
					<div className="form-grid">
						<div className="flex flex-col gap-6">
							<div className="input-group">
								<label className="text-lg font-semibold">DATE OF CURRENT AFFAIRS</label>
								<DatePicker
									placeholder="Select date"
									suffixIcon={<CalendarOutlined/>}
									className="w-full"
								/>
							</div>

							<div>
								<Input placeholder="GLORY" size="large"/>
							</div>

							<Button type="primary" className="full-width-button">
								UPDATE CLASSIFICATION
							</Button>

							<div>
                <textarea
					rows={5}
					className="textarea"
					placeholder="Enter Description"
				>
                  Millionare kjlansklffda afkljfk jnaksj dajh gaksjdg jagsbgih gajsddguhasgsda
                  sgvdjasdlugaibi oiakshdni iaugsd lualdshasd
                </textarea>
							</div>

							<Button type="primary" className="full-width-button">
								ENTER DESCRIPTION
							</Button>
						</div>

						<div className="flex flex-col items-center gap-6">
							<Upload className="w-full">
								<Button
									icon={<UploadOutlined/>}
									className="full-width-button"
								>
									Upload Image
								</Button>
							</Upload>

							<Button type="primary" className="full-width-button">
								CHANGE PHOTO
							</Button>
							<Button type="primary" className="full-width-button">
								CONFIRM
							</Button>
						</div>
					</div>

					<div className="form-footer">
						<Button type="primary" className="full-width-button">
							ADD MORE
						</Button>
						<Button type="primary" className="full-width-button" onClick={handleQues}>
							SUBMIT
						</Button>
					</div>
				</div>
			</main>
		</div>
	);
}
