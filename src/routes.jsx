import { createBrowserRouter } from "react-router-dom"
import App from './App'
import ListPacients from './pages/ListPatients'

const router = createBrowserRouter([
   
    {
        path: '/',
        element: <App />
    },
    {
        path: '/Pacientes-cadastrados',
        element: <ListPacients />
    }


])

export default router