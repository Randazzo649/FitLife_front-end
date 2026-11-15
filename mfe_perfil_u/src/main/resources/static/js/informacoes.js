(() => {
  const unwrap = x => x?.usuario || x?.user || x?.data || x;
  const form = document.getElementById('FormularioMedico');
  if (!form) return;
  const peso = document.getElementById('PesoIMC'), altura = document.getElementById('AlturaIMC');
  function calcular() {
    const p=Number(peso.value), a=Number(altura.value);
    if (!(p>0 && a>=.5 && a<=2.8)) { alert('Informe peso e altura válidos.'); return false; }
    const imc=p/(a*a), niveis=[[18.5,'Abaixo do peso','#ffb900'],[25,'Peso adequado','#2d9a00'],[30,'Sobrepeso','#f17e00'],[35,'Obesidade Grau I','#ff1b00'],[40,'Obesidade Grau II','#ae1200'],[Infinity,'Obesidade Grau III','#801711']];
    const nivel=niveis.find(x=>imc<x[0]); document.getElementById('ValorIMC').textContent=imc.toFixed(1).replace('.',','); document.getElementById('NivelIMC').textContent=nivel[1]; document.getElementById('IndicadorIMC').style.background=nivel[2]; return true;
  }
  document.getElementById('buttonCalcular').addEventListener('click',calcular);
  async function iniciar() {
    try {
      const u=unwrap(await FitLifeApi.usuario()); peso.value=u.peso ?? ''; altura.value=u.altura ?? '';
      form.elements.restricao.value=u.restricao || '';
      const saude=Array.isArray(u.saude)?u.saude:(Array.isArray(u.saude_json)?u.saude_json:[]);
      form.querySelectorAll('[name=saude]').forEach(c=>c.checked=saude.includes(c.value));
      form.querySelectorAll('[name=objetivoMedico]').forEach(c=>c.checked=(u.objetivoMedico || u.objetivo || '')===c.value);
      if (peso.value && altura.value) calcular();
    } catch(error) { alert(`Não foi possível carregar as informações médicas: ${error.message}`); }
  }
  form.addEventListener('submit',async e=>{
    e.preventDefault(); if(!form.reportValidity()||!calcular()) return;
    const saude=[...form.querySelectorAll('[name=saude]:checked')].map(x=>x.value);
    const data={peso:Number(peso.value),altura:Number(altura.value),saude,restricao:form.elements.restricao.value,objetivoMedico:form.querySelector('[name=objetivoMedico]:checked')?.value || ''};
    try { await FitLifeApi.atualizarInformacoes(data); alert('Informações atualizadas!'); location.href='/perfil'; }
    catch(error) { alert(`Não foi possível atualizar as informações: ${error.message}`); }
  });
  document.addEventListener('DOMContentLoaded',iniciar);
})();
