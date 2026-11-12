/* Informações — Atualização das informações médicas e cálculo do IMC.*/

(() => {
  // Busca os dados já cadastrados e identifica os campos do formulário médico.
  const d = FitDados.ler(), form = document.getElementById('FormularioMedico'), peso = document.getElementById('PesoIMC'), altura = document.getElementById('AlturaIMC');
  // Preenche o formulário com as informações armazenadas anteriormente.
  peso.value = d.peso || '';
  altura.value = d.altura || '';
  form.elements.restricao.value = d.restricao || '';
  form.querySelectorAll('[name=saude]').forEach(c => c.checked = (d.saude || []).includes(c.value));
  form.querySelectorAll('[name=objetivoMedico]').forEach(c => c.checked = (d.objetivo || '').includes(c.value));
  
  // Confere peso e altura, calcula o IMC e exibe sua classificação e cor.
  function calcular() {
    const p = Number(peso.value), a = Number(altura.value);
    if (!(p > 0 && a >= .5 && a <= 2.8)) {
      alert('Informe peso e altura válidos.');
      return false;
    }
    const imc = p / (a * a);
    const niveis = [[18.5, 'Abaixo do peso', '#ffb900'], [25, 'Peso adequado', '#2d9a00'], [30, 'Sobrepeso', '#f17e00'], [35, 'Obesidade Grau I', '#ff1b00'], [40, 'Obesidade Grau II', '#ae1200'], [Infinity, 'Obesidade Grau III', '#801711']];
    const nivel = niveis.find(n => imc < n[0]);
    document.getElementById('ValorIMC').textContent = imc.toFixed(1).replace('.', ',');
    document.getElementById('NivelIMC').textContent = nivel[1];
    document.getElementById('IndicadorIMC').style.background = nivel[2];
    return true;
  }
 
  // Permite recalcular pelo botão e calcula automaticamente se já houver medidas.
  document.getElementById('buttonCalcular').addEventListener('click', calcular);
  if (peso.value && altura.value)calcular();
 
  // Valida o formulário, salva as alterações e retorna à página de perfil.
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity() || !calcular()) return;
    FitDados.salvar({
      peso: peso.value, altura: altura.value, saude: [...form.querySelectorAll('[name=saude]:checked')].map(x => x.value), restricao: form.elements.restricao.value, objetivo: form.querySelector('[name=objetivoMedico]:checked')?.value || d.objetivo
    });
    alert('Informações atualizadas!');
    location.href = '../perfil/perfil.html';
  });
})();
