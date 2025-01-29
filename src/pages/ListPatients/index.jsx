import './index.css';
import api from '../../services/api';
import { useEffect, useState } from 'react';
import Trash from '../../assets/trash.png';
import { useNavigate } from "react-router-dom";

function ListPatients() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [file, setFile] = useState(null);

    useEffect(() => {
        async function getPatients() {
            try {
                const { data } = await api.get('/patients');
                console.log("Pacientes carregados:", data);
                if (Array.isArray(data)) {
                    setPatients(data); // Atualiza com os pacientes existentes
                } else {
                    console.error('A resposta da API não é um array:', data);
                }
            } catch (error) {
                console.error('Erro ao buscar pacientes:', error);
            }
        }
        getPatients();
    }, []);

    async function deletePatients(id) {
        try {
            const response = await api.delete(`/patients/${id}`);
            if (response.status === 200) {
                // Atualiza lista após deletar
                setPatients((prevPatients) => prevPatients.filter(patient => patient.id !== id));
            } else {
                console.error('Erro ao deletar paciente, status:', response.status);
            }
        } catch (error) {
            console.error('Erro ao deletar paciente:', error);
        }
    }

    async function handleFileUpload(e) {
        e.preventDefault();

        if (!file) {
            alert("Por favor, selecione um arquivo Excel para enviar.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post('/patients/upload', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            alert("Arquivo enviado com sucesso!");

            console.log("Resposta do servidor após upload:", response.data);

            // Verifica se a resposta contém dados esperados
            if (response.data && Array.isArray(response.data)) {
                setPatients(response.data);  // Atualiza completamente com os novos pacientes
            } else {
                console.error('Resposta do servidor não é um array:', response.data);
                alert("Clique em OK para atualizar página"); //mensagem: Erro ao processar os dados recebidos.
                window.location.reload(); // Força a atualização da página após o erro
            }
        } catch (error) {
            console.error("Erro ao fazer upload do arquivo:", error);
            alert("Erro ao processar o arquivo.");
            window.location.reload(); // Força a atualização da página após o erro
        }
    }

    return (
        <div>
            <header>
                <img src="../public/logo-cpquali.svg" alt="Logo CPQuali" />
                <h1>Sistema Unificado para Pesquisa Clínica</h1>
            </header>

            <h1>Lista de Pacientes Cadastrados</h1>

            <form onSubmit={handleFileUpload}>
                <label htmlFor="uploadExcel">Upload de Excel:</label>
                <input
                    type="file"
                    id="uploadExcel"
                    accept=".xlsx, .xls"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button type="submit">Enviar Excel</button>
            </form>

            {patients.length === 0 ? (
                <p>Carregando pacientes...</p>
            ) : (
                patients.map((patient) => (
                    <div key={patient.id}>
                        <h3>{patient.name}</h3>
                        <p><strong>CPF:</strong> {patient.CPF}</p>
                        <p><strong>Telefone:</strong> {patient.phone}</p>
                        <p><strong>Email:</strong> {patient.email}</p>
                        <p><strong>Local:</strong> {patient.local}</p>
                        <button 
                            type="button" 
                            className="img-trash" 
                            onClick={() => deletePatients(patient.id)}
                        >
                            <img src={Trash} alt="Excluir" />
                        </button>
                    </div>
                ))
            )}

            <button type="button" onClick={() => navigate('/')}>Voltar</button>

            <footer>
                <p>© 2025 Sistema Unificado para Pesquisa Clínica</p>
            </footer>
        </div>
    );
}

export default ListPatients;
