import React, { useState, useRef } from "react";
import "./App.css";
import api from '../src/services/api';
import { useNavigate } from "react-router-dom";


function App() {
  const inputName = useRef();
  const inputCpf = useRef();
  const inputEmail = useRef();
  const inputPhone = useRef();
  const inputLocal = useRef();

  const navigate = useNavigate()

  // Função de cadastro de paciente
  async function registerNewPatients() {
    const cpf = inputCpf.current.value;
    const email = inputEmail.current.value;

    // Verificar se o CPF tem exatamente 11 caracteres
    if (cpf.length !== 11 || isNaN(cpf)) {
      alert("O CPF deve ter exatamente 11 números.");
      return;
    }

    try {
      // Verificar se o paciente já existe pelo CPF ou e-mail
      const response = await api.get('/patients', {
        params: { cpf, email },
      });

      // Se o paciente já existe, exibe um alerta
      if (response.data.length > 0) {
        alert(`Paciente já cadastrado e ativo em pesquisa na unidade ${response.data[0].local}.`);
      } else {
        // Se não existir, cadastra o paciente
        const data = await api.post('/patients', {
          email: email,
          name: inputName.current.value,
          CPF: parseInt(cpf),
          phone: parseInt(inputPhone.current.value),
          local: inputLocal.current.value,
        });
        console.log(data);
        alert("Paciente cadastrado com sucesso!");

        navigate('/Pacientes-cadastrados')

      }
    } catch (error) {
      console.error("Erro ao verificar ou cadastrar paciente:", error);
    }
  }

  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    email: "",
    phone: "",
    local: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).every((field) => field.trim() !== "")) {
      setPatients([...patients, formData]);
      setFormData({ name: "", cpf: "", email: "", phone: "", local: "" });
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  return (
    <div className="App">
      <header>
        <img src="../public/logo-cpquali.svg" alt="Logo CPQuali" />
        <h1>Sistema Unificado para Pesquisa Clínica</h1>
      </header>
      <main>
        <section id="form-section">
          <h2>Cadastro de Pacientes</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Nome do Paciente:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Digite o nome completo"
              ref={inputName}
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="cpf">CPF(apenas números):</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              placeholder="Digite o CPF"
              ref={inputCpf}
              value={formData.cpf}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Digite o e-mail"
              ref={inputEmail}
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="phone">Telefone com DDD:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Digite o telefone"
              ref={inputPhone}
              value={formData.phone}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="local">Unidade:</label>
            <input
              type="text"
              id="local"
              name="local"
              placeholder="Digite o local"
              ref={inputLocal}
              value={formData.local}
              onChange={handleInputChange}
              required
            />

            <button type="button" onClick={registerNewPatients}>Cadastrar Paciente</button>
            <button type="button" onClick={() => navigate('/Pacientes-cadastrados')}>Lista de Pacientes Cadastrados</button>
          
          </form>

          

        </section>

        
      </main>
      <footer>
        <p>© 2025 Sistema Unificado para Pesquisa Clínica</p>
      </footer>
    </div>
  );
}

export default App;

