import { useState } from 'react'
import { Button } from 'antd'
import './App.css'
import SubmissionsTable from './components/submissions-table/SubmissionsTable'
import ApplicationForm from './components/application-form/ApplicationForm'
import MainCvUpload from './components/main-cv-upload/MainCvUpload'
import type { ApplicationData } from './types/application.types'

function App() {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [submissions, setSubmissions] = useState<ApplicationData[]>([])

  const handleAdd = (newItem: ApplicationData) => {
    setSubmissions(prev => [...prev, newItem])
  }

  return (
    <div className="app">
      <h1>CV Optimizer</h1>
      <MainCvUpload />
      <Button type="primary" onClick={() => setShowModal(true)}>ADD SUBMISSION</Button>
      <ApplicationForm onClose={() => setShowModal(false)} isOpen={showModal} onAdd={handleAdd}/>
      <SubmissionsTable submissions={submissions} setSubmissions={setSubmissions}/>
    </div>
  )
}

export default App
