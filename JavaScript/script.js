let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

function formatarData(data) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function salvar() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
  renderizarTarefas();
}

function renderizarTarefas() {
  document.getElementById("lista-tarefas").innerHTML = "";
  document.getElementById("lista-importante").innerHTML = "";
  document.getElementById("lista-concluidos").innerHTML = "";
  document.getElementById("lista-lixeira").innerHTML = "";

  tarefas.forEach((tarefa, index) => {
    const li = document.createElement("li");
    li.classList.add("tarefa");
    li.innerHTML = `
      <div>
        <strong>${tarefa.titulo}</strong><br>
        <small>${formatarData(tarefa.data)} - ${tarefa.categoria}</small><br>
        <em>${tarefa.descricao}</em><br>
        <span>Status: ${tarefa.status}</span>
      </div>
      <div class="botoes">
        ${!tarefa.lixeira ? `
          <button onclick="mudarStatus(${index})">🔁</button>
          <button onclick="editarTarefa(${index})">✏️</button>
          <button onclick="marcarImportante(${index})">⭐</button>
          <button onclick="moverParaLixeira(${index})">🗑️</button>
        ` : `
          <button onclick="restaurar(${index})">↩️</button>
          <button onclick="excluirTarefa(${index})">❌</button>
        `}
      </div>
    `;

    if (tarefa.lixeira) {
      document.getElementById("lista-lixeira").appendChild(li);
    } else if (tarefa.status === "concluída") {
      document.getElementById("lista-concluidos").appendChild(li);
    } else if (tarefa.importante) {
      document.getElementById("lista-importante").appendChild(li);
    } else {
      document.getElementById("lista-tarefas").appendChild(li);
    }
  });
}

document.getElementById("form-tarefa").addEventListener("submit", function(e) {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const descricao = document.getElementById("descricao").value;
  const data = document.getElementById("data").value;
  const categoria = document.getElementById("categoria").value;
  const status = document.getElementById("status").value;

  if (this.dataset.editando) {
    const index = this.dataset.editando;
    tarefas[index] = { ...tarefas[index], titulo, descricao, data, categoria, status };
    delete this.dataset.editando;
  } else {
    tarefas.push({ titulo, descricao, data, categoria, status, importante: false, lixeira: false });
  }

  this.reset();
  salvar();
});

function editarTarefa(index) {
  const tarefa = tarefas[index];
  document.getElementById("titulo").value = tarefa.titulo;
  document.getElementById("descricao").value = tarefa.descricao;
  document.getElementById("data").value = tarefa.data;
  document.getElementById("categoria").value = tarefa.categoria;
  document.getElementById("status").value = tarefa.status;

  document.getElementById("form-tarefa").dataset.editando = index;
}

function mudarStatus(index) {
  const estados = ["pendente", "em andamento", "concluída"];
  const atual = tarefas[index].status;
  const proximo = estados[(estados.indexOf(atual) + 1) % estados.length];
  tarefas[index].status = proximo;
  salvar();
}

function marcarImportante(index) {
  tarefas[index].importante = !tarefas[index].importante;
  salvar();
}

function moverParaLixeira(index) {
  tarefas[index].lixeira = true;
  salvar();
}

function restaurar(index) {
  tarefas[index].lixeira = false;
  salvar();
}

function excluirTarefa(index) {
  if (confirm("Deseja excluir permanentemente?")) {
    tarefas.splice(index, 1);
    salvar();
  }
}

// Controle das abas
document.querySelectorAll('.item-menu').forEach(item => {
  item.addEventListener('click', () => {
    const target = item.getAttribute('data-target');
    document.querySelectorAll('.aba').forEach(sec => sec.classList.remove('ativa'));
    document.getElementById(target).classList.add('ativa');
  });
});

renderizarTarefas();