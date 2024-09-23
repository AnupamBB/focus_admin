import {Input, Button, Radio, Space} from 'antd';
import React from 'react';
import './styles.css';

export default function ExamQuestionScreen() {
	return (
		<div className="exam-container">
			<header className="exam-header">
				<h1 className="text-4xl font-bold">BidYa Admin Panel</h1>
			</header>

			<main className="exam-main">
				<div className="exam-form">
					{[1, 2, 3, 4].map((question, qIndex) => (
						<div key={qIndex} className="question-block">
							<div className="question-row">
								<span className="text-lg font-bold">{qIndex + 1}</span>
								<Input placeholder="Enter question"/>
							</div>

							<div className="options-row">
								<div>
									{[1, 2, 3, 4].map((option, oIndex) => (
										<div key={oIndex} className="option-block">
											<Radio>
												<Space>
													<Input placeholder={`Option ${oIndex + 1}`}/>
												</Space>
											</Radio>
										</div>
									))}
									<Button className="full-width-button">Add Option</Button>
								</div>

								<div className="flex flex-col items-center">
									<Button className="full-width-button mb-4" size="large">
										CONFIRM ANSWER
									</Button>
									<Button className="full-width-button" size="large">
										SAVE
									</Button>
								</div>
							</div>
						</div>
					))}

					<div className="action-buttons">
						<Button className="full-width-button">Add Question</Button>
						<Button className="full-width-button">CONFIRM CHANGES AND EXIT</Button>
					</div>
				</div>
			</main>
		</div>
	);
}
