
<script setup>
import { ref, onMounted } from 'vue'

// Endereço da nossa API
const API = 'http://localhost:3000'

// Dados que serão carregados do backend
const medicos = ref([])
const agendamentos = ref([])

// Campos do formulário
const medico_id = ref('')
const paciente_nome = ref('')
const data_hora = ref('')
const observacao = ref('')

// Filtros
const filtroMedico = ref('')
const filtroData = ref('')

// Mensagens para o usuário
const mensagem = ref('')
const erro = ref('')

// Buscar médicos no backend
async function carregarMedicos() {
  try {
    const resposta = await fetch(`${API}/api/medicos`)
    medicos.value = await resposta.json()
  } catch {
    erro.value = 'Não foi possível carregar os médicos.'
  }
}

// Buscar agendamentos no backend
async function carregarAgendamentos() {
  try {
    const parametros = new URLSearchParams()

    if (filtroMedico.value) {
      parametros.append('medico_id', filtroMedico.value)
    }

    if (filtroData.value) {
      parametros.append('data', filtroData.value)
    }

    const resposta = await fetch(
      `${API}/api/agendamentos?${parametros.toString()}`
    )

    if (!resposta.ok) {
      throw new Error('Erro ao buscar agendamentos.')
    }

    agendamentos.value = await resposta.json()
  } catch (error) {
    erro.value = error.message
  }
}

// Cadastrar novo agendamento
async function criarAgendamento() {
  mensagem.value = ''
  erro.value = ''

  try {
    const resposta = await fetch(`${API}/api/agendamentos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        medico_id: medico_id.value,
        paciente_nome: paciente_nome.value,
        data_hora: data_hora.value,
        observacao: observacao.value
      })
    })

    const resultado = await resposta.json()

    if (!resposta.ok) {
      throw new Error(resultado.error || resultado.erro || 'Erro ao cadastrar.')
    }

    mensagem.value = 'Agendamento cadastrado com sucesso!'

    medico_id.value = ''
    paciente_nome.value = ''
    data_hora.value = ''
    observacao.value = ''

    await carregarAgendamentos()
  } catch (error) {
    erro.value = error.message
  }
}

// Excluir agendamento
async function cancelarAgendamento(id) {
  const confirmar = window.confirm('Deseja realmente cancelar este agendamento?')

  if (!confirmar) return

  try {
    const resposta = await fetch(`${API}/api/agendamentos/${id}`, {
      method: 'DELETE'
    })

    const resultado = await resposta.json()

    if (!resposta.ok) {
      throw new Error(resultado.error || resultado.erro || 'Erro ao cancelar.')
    }

    mensagem.value = 'Agendamento cancelado com sucesso!'
    await carregarAgendamentos()
  } catch (error) {
    erro.value = error.message
  }
}

// Formatar data para exibição
function formatarData(data) {
  if (!data) return ''

  const [dia, hora] = data.split(' ')
  const [ano, mes, diaMes] = dia.split('-')

  return `${diaMes}/${mes}/${ano} ${hora?.slice(0, 5) || ''}`
}

// Carregar dados quando a página abrir
onMounted(() => {
  carregarMedicos()
  carregarAgendamentos()
})
</script>

<template>
  <main class="container">
    <header class="cabecalho">
      <div>
        <p class="subtitulo">GESTÃO DE SAÚDE</p>
        <h1>Agendamento Médico</h1>
        <p>Gerencie consultas e horários em um só lugar.</p>
      </div>
    </header>

    <section class="painel">
      <h2>Novo agendamento</h2>

      <form @submit.prevent="criarAgendamento">
        <label>Nome do paciente</label>
        <input
          v-model="paciente_nome"
          type="text"
          placeholder="Digite o nome do paciente"
          required
        />

        <label>Médico responsável</label>
        <select v-model="medico_id" required>
          <option value="" disabled>Selecione um médico</option>
          <option
            v-for="medico in medicos"
            :key="medico.id"
            :value="medico.id"
          >
            {{ medico.nome }} - {{ medico.especialidade }}
          </option>
        </select>

        <label>Data e horário</label>
        <input v-model="data_hora" type="datetime-local" required />

        <label>Observação (opcional)</label>
        <textarea
          v-model="observacao"
          placeholder="Informações adicionais"
        ></textarea>

        <button type="submit">Cadastrar agendamento</button>
      </form>

      <p v-if="mensagem" class="sucesso">{{ mensagem }}</p>
      <p v-if="erro" class="erro">{{ erro }}</p>
    </section>

    <section class="painel">
      <h2>Agendamentos cadastrados</h2>

      <div class="filtros">
        <div>
          <label>Filtrar por médico</label>
          <select v-model="filtroMedico">
            <option value="">Todos os médicos</option>
            <option
              v-for="medico in medicos"
              :key="medico.id"
              :value="medico.id"
            >
              {{ medico.nome }}
            </option>
          </select>
        </div>

        <div>
          <label>Filtrar por data</label>
          <input type="date" v-model="filtroData" />
        </div>

        <button @click="carregarAgendamentos">Buscar</button>
        <button
          type="button"
          class="botao-secundario"
          @click="filtroMedico = ''; filtroData = ''; carregarAgendamentos()"
        >
          Limpar
        </button>
      </div>

      <div class="tabela-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Especialidade</th>
              <th>Data e horário</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="agendamento in agendamentos" :key="agendamento.id">
              <td>{{ agendamento.id }}</td>
              <td>{{ agendamento.paciente_nome }}</td>
              <td>{{ agendamento.medico_nome }}</td>
              <td>{{ agendamento.especialidade }}</td>
              <td>{{ formatarData(agendamento.data_hora) }}</td>
              <td>
                <button
                  class="botao-excluir"
                  @click="cancelarAgendamento(agendamento.id)"
                >
                  Cancelar
                </button>
              </td>
            </tr>

            <tr v-if="agendamentos.length === 0">
              <td colspan="6" class="vazio">
                Nenhum agendamento encontrado.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>
