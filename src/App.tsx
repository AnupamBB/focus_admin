import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from '../src/screens/login.tsx';
import Dashboard from '../src/screens/dashboard.tsx';
import ExamQuestionScreen from "./screens/ExamQuestionScreen.tsx";
import UploadAffairs from "./screens/UploadAffairs.tsx";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login/>}/>
				<Route path="/dashboard" element={<Dashboard/>}/>
				<Route path="/upload-current-affairs" element={<UploadAffairs/>}/>
				<Route path="/upload-exam-questions" element={<ExamQuestionScreen/>}/>
			</Routes>
		</Router>
	);
}

export default App;