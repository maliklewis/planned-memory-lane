import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MemoryForm from './components/MemoryForm'
import MemoriesList from './components/MemoriesList'
import MemoryView from './components/MemoryView'
import Header from './components/Header'

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
      <Route path="/" element={<MemoriesList />} />
      <Route path="/create" element={<MemoryForm />} />
      <Route path="/memory/edit/:memoryid" element={<MemoryForm />} />
      <Route path="memory/:id" element={<MemoryView />} />
    </Routes>
    </Router>
  )
}

export default App
