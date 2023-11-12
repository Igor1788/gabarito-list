const firebaseConfig = {
    apiKey: "AIzaSyCp0DnKfWTCfx5zhsia_ejxcxrqdTCCmHM",
    authDomain: "primoflix-8691b.firebaseapp.com",
    databaseURL: "https://primoflix-8691b.firebaseio.com",
    projectId: "primoflix-8691b",
    storageBucket: "primoflix-8691b.appspot.com",
    messagingSenderId: "466298232490",
    appId: "1:466298232490:web:b7667bb30d4653fc943ad3"
  };
  const app = firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  
  const numeroRef = database.ref('Numero');
  const chamadasRef = database.ref('Chamadas');
  const atualRef = database.ref('Atual');
  const gabaritoRef = database.ref('Gabarito');
  
  let valorAtual = null;
  let chamadas = [];
  
  // Variáveis globais para os elementos DOM
  const respostaAzulElement = document.getElementById('resposta-azul');
  const respostaAmarelaElement = document.getElementById('resposta-amarela');
  const respostaBrancaElement = document.getElementById('resposta-branca');
  const respostaRosaElement = document.getElementById('resposta-rosa');
  const provaAzulNumero = document.getElementById('prova-azul').querySelector('.prova-numero');
  const provaAmarelaNumero = document.getElementById('prova-amarela').querySelector('.prova-numero');
  const provaBrancaNumero = document.getElementById('prova-branca').querySelector('.prova-numero');
  const provaRosaNumero = document.getElementById('prova-rosa').querySelector('.prova-numero');
  
  function atualizarContador(valor) {
    document.getElementById('valorContador').innerText = valor;
    const percentual = (valor - 1) / (200 - 1);
    document.getElementById('barraProgresso').style.width = percentual * 100 + '%';
  }
  
  function atualizarChamada() {
    if (chamadas.length > 0) {
      const indiceAleatorio = Math.floor(Math.random() * chamadas.length);
      const chamadaSelecionada = chamadas[indiceAleatorio];
      document.getElementById('chamadaTitulo').innerText = chamadaSelecionada;
    }
  }
  
  function atualizarGabarito(questaoAtual) {
    gabaritoRef.child(questaoAtual).once('value', snapshot => {
      const questao = snapshot.val();
      if (questao) {
        respostaAzulElement.innerText = ` - ${questao.azul.opcao}`;
        provaAzulNumero.innerText = questao.azul.questao;
  
        respostaAmarelaElement.innerText = ` - ${questao.amarela.opcao}`;
        provaAmarelaNumero.innerText = questao.amarela.questao;
  
        respostaBrancaElement.innerText = ` - ${questao.branca.opcao}`;
        provaBrancaNumero.innerText = questao.branca.questao;
  
        respostaRosaElement.innerText = ` - ${questao.rosa.opcao}`;
        provaRosaNumero.innerText = questao.rosa.questao;
      }
    });
  }
  
  // Atualiza o gabarito baseado na mudança de 'Atual'
  atualRef.on('value', snapshot => {
    const valorAtual = snapshot.val();
    atualizarGabarito(valorAtual);
  });
  
  // Atualiza o gabarito baseado em mudanças no gabarito
  gabaritoRef.on('value', () => {
    atualRef.once('value', snapshot => {
      atualizarGabarito(snapshot.val());
    });
  });
  
  // Escutando mudanças em 'Chamadas'
  chamadasRef.on('value', snapshot => {
    chamadas = snapshot.val() || [];
    atualizarChamada();
  });
  
  // Escutando mudanças em 'Numero'
  numeroRef.on('value', snapshot => {
    atualizarContador(snapshot.val());
  });
  
  setInterval(atualizarChamada, 10000);