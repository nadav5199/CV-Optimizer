import { useState } from 'react'
import './App.css'
import SubmissionsTable from './components/submissions-table/SubmissionsTable'
import ApplicationForm from './components/application-form/ApplicationForm'
function App() {
  const [showModal, setShowModal] = useState<boolean>(false)
  return (
    <div className="app">
      <h1>CV Optimizer</h1>
      <button onClick={() => setShowModal(true)}>ADD SUBMISSION</button>
      <ApplicationForm onClose={() => setShowModal(false)} isOpen={showModal}/>
      <SubmissionsTable/>
    </div>
  )
}

export default App
