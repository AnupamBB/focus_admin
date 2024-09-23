import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from '../src/screens/login.tsx';
import Dashboard from '../src/screens/dashboard.tsx';
import UploadFile from '../src/screens/upload.tsx'
import ExamQuestionScreen from "./screens/ExamQuestionScreen.tsx";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login/>}/>
				<Route path="/dashboard" element={<Dashboard/>}/>
				<Route path="/upload" element={<UploadFile/>}/>
				<Route path="/ExamQuestionScreen" element={<ExamQuestionScreen/>}/>
			</Routes>
		</Router>
	);
}

export default App;