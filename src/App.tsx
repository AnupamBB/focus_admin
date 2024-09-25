import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from '../src/screens/login.tsx';
import Dashboard from '../src/screens/dashboard.tsx';
import ExamQuestionScreen from "./screens/questions/ExamQuestionScreen.tsx";
import UploadAffairs from "./screens/UploadAffairs.tsx";
import QuestionPapers from "./screens/questions/QuestionPapers.tsx";
import Notes from "./screens/questions/Notes.tsx";
import References from "./screens/questions/References.tsx";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login/>}/>
				<Route path="/dashboard" element={<Dashboard/>}/>
				<Route path="/upload-current-affairs" element={<UploadAffairs/>}/>
				<Route path="/live-test-questions" element={<ExamQuestionScreen/>}/>
				<Route path="/question-papers" element={<QuestionPapers/>}/>
				<Route path="/notes" element={<Notes/>}/>
				<Route path="/references" element={<References/>}/>
			</Routes>
		</Router>
	);
}

export default App;