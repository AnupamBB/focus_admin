import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from '../src/screens/login.tsx';
import ExamQuestionScreen from "./screens/questions/ExamQuestionScreen.tsx";
import UploadAffairs from "./screens/UploadAffairs.tsx";
import QuestionPapers from "./screens/questions/QuestionPapers.tsx";
import Notes from "./screens/questions/Notes.tsx";
import References from "./screens/questions/References.tsx";
import EditExamQuestion from "./screens/edit/ExamQuestionEdit.tsx";
import EditAffairs from "./screens/edit/CurrentAffairsEdit.tsx";
import EditNotes from "./screens/edit/NotesEdit.tsx";
import EditQuestionPaper from "./screens/edit/EditQsnPaper.tsx";
import EditReference from "./screens/edit/EditRef.tsx";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login/>}/>
				<Route path="/upload-current-affairs" element={<UploadAffairs/>}/>
				<Route path="/live-test-questions" element={<ExamQuestionScreen/>}/>
				<Route path="/edit-test-questions" element={<EditExamQuestion/>}/>
				<Route path="/edit-current-affairs" element={<EditAffairs/>}/>
				<Route path="/edit-question-paper" element={<EditQuestionPaper/>}/>
				<Route path="/edit-reference" element={<EditReference/>}/>
				<Route path="/edit-notes" element={<EditNotes/>}/>
				<Route path="/question-papers" element={<QuestionPapers/>}/>
				<Route path="/notes" element={<Notes/>}/>
				<Route path="/references" element={<References/>}/>
			</Routes>
		</Router>
	);
}

export default App;