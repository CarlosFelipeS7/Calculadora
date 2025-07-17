
// === MODO BÁSICO ===

// Obtém o elemento de display principal para mostrar operações e resultados
const display = document.getElementById("display");

// Função para anexar um caractere (número ou operador) ao display
function append(char) {
  // Se o display estiver "0", substitui pelo novo char; caso contrário, concatena
  display.textContent = display.textContent === "0"
    ? char
    : display.textContent + char;
}

// Função para limpar o display (resetar para "0")
function clearDisplay() {
  display.textContent = "0";
}

// Função para calcular o que está no display usando eval (cuidado com segurança)
function calculate() {
  try {
    // Avalia a expressão e mostra o resultado
    display.textContent = eval(display.textContent);
  } catch {
    // Em caso de erro (ex.: sintaxe inválida), exibe "Erro"
    display.textContent = "Erro";
  }
}



// === CUBO 3D ===
// Rotaciona o cubo para mostrar a face desejada (0=básica,1=amostra,2=IC)
function rotateTo(faceIndex) {
  document.getElementById("cube").style.transform =
    `translateZ(-150px) rotateY(${faceIndex * -120}deg)`;
}







// === TAMANHO DE AMOSTRA ===
function calcSampleSize() {
  // Lê tipo de cálculo (média ou proporção)
  const tipo = document.getElementById("calculoTipo").value;
  // Lê valores de z, sigma (desvio) e margem de erro E
  const z = parseFloat(document.getElementById("z").value);
  const sigma = parseFloat(document.getElementById("sigma").value);
  const e = parseFloat(document.getElementById("e").value);
  // Proporção p (padrão 0.5 se vazio)
  const p = parseFloat(document.getElementById("pAmostra").value) || 0.5;
  // Elemento onde mostramos o resultado de n
  const disp = document.getElementById("amostra-display-text");

  // Valida entradas obrigatórias
  if (
    isNaN(z) ||
    isNaN(e) ||
    (tipo === "media" && isNaN(sigma)) ||
    (tipo === "proporcao" && isNaN(p))
  ) {
    disp.textContent = "Por favor, insira valores válidos.";
    return; // sai sem calcular
  }

  let n;
  if (tipo === "media") {
    // Fórmula: n = (z * sigma / E)^2
    n = Math.pow((z * sigma) / e, 2);
  } else {
    // Fórmula: n = (z^2 * p * (1-p)) / E^2
    n = (Math.pow(z, 2) * p * (1 - p)) / Math.pow(e, 2);
  }
  // Arredonda para cima e exibe
  disp.textContent = `n ≈ ${Math.ceil(n)}`;
}

// Função para limpar todos os campos de amostra e resetar o estado
function clearSample() {
  ["z", "sigma", "e", "pAmostra"].forEach((id) => {
    document.getElementById(id).value = "";
  });
  // Volta ao modo "media"
  document.getElementById("calculoTipo").value = "media";
  document.getElementById("amostra-display-text").textContent = "Amostra: Média";
  // Atualiza visibilidade de campos
  updateAmostraFields();
}



// === INTERVALO DE CONFIANÇA ===
function calcConfidenceInterval() {
  // Lê tipo de IC (media ou proporcao)
  const tipo = document.getElementById("icTipoCalculo").value;
  const displayText = document.getElementById("ic-display-text");

  // Leitura de campos comuns: n e z
  const n = parseFloat(document.getElementById("n").value);
  const z = parseFloat(document.getElementById("z2").value);

  // Campos específicos: media (mean, stddev) ou proporcao (p)
  const mean = parseFloat(document.getElementById("mean").value);
  const stddev = parseFloat(document.getElementById("stddev").value);
  const p = parseFloat(document.getElementById("pIC").value);

  // Validações básicas
  const okBase = !isNaN(n) && !isNaN(z);
  const okMedia = okBase && tipo === "media" && !isNaN(mean) && !isNaN(stddev);
  const okProp = okBase && tipo === "proporcao" && !isNaN(p);

  if (okMedia || okProp) {
    let margin, center;
    if (tipo === "media") {
      // Margem: z * (stddev / sqrt(n))
      margin = z * (stddev / Math.sqrt(n));
      center = mean; // ponto central
    } else {
      // Margem: z * sqrt( p*(1-p) / n )
      margin = z * Math.sqrt((p * (1 - p)) / n);
      center = p;
    }
    // Cálculo dos limites inferior e superior
    const lower = (center - margin).toFixed(2);
    const upper = (center + margin).toFixed(2);
    // Exibe IC no formato [lower, upper]
    displayText.textContent = `IC ≈ [${lower}, ${upper}]`;
  } else {
    // Se faltar valor, exibe rótulo padrão
    displayText.textContent = `IC: ${tipo === "media" ? "Média" : "Proporção"}`;
  }
}

// Limpa todos os campos do IC e retorna ao estado inicial
function clearIC() {
  ["mean", "stddev", "n", "z2", "pIC"].forEach((id) => {
    document.getElementById(id).value = "";
  });
  document.getElementById("icTipoCalculo").value = "media";
  document.getElementById("ic-display-text").textContent = "IC: Média";
  updateICFields();
}










// === FUNÇÕES AUXILIARES DE VISIBILIDADE ===
// Mostra/esconde campos de Media/Proporcao na aba Amostra
function updateAmostraFields() {
  const tipo = document.getElementById("calculoTipo").value;
  document.getElementById("amostra-media-fields").style.display =
    tipo === "media" ? "block" : "none";
  document.getElementById("amostra-proporcao-fields").style.display =
    tipo === "proporcao" ? "block" : "none";
}

// Mostra/esconde campos de Media/Proporcao na aba IC
function updateICFields() {
  const tipo = document.getElementById("icTipoCalculo").value;
  document.getElementById("ic-media-fields").style.display =
    tipo === "media" ? "block" : "none";
  document.getElementById("ic-proporcao-fields").style.display =
    tipo === "proporcao" ? "block" : "none";
}


// === MENUS INTERATIVOS ===
// Alterna visibilidade do menu de seleção na aba Amostra
function toggleTipoCalculoAmostraMenu() {
  const menu = document.getElementById("amostra-tipo-menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Define o tipo de cálculo na aba Amostra e atualiza display
function setTipoCalculoAmostra(tipo) {
  document.getElementById("calculoTipo").value = tipo;
  document.getElementById("amostra-display-text").textContent =
    "Amostra: " + (tipo === "media" ? "Média" : "Proporção");
  document.getElementById("amostra-tipo-menu").style.display = "none";
  updateAmostraFields();
}

// Alterna visibilidade do menu de seleção na aba IC
function toggleTipoCalculoMenu() {
  const menu = document.getElementById("ic-tipo-menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Define o tipo de cálculo na aba IC e atualiza display
function setTipoCalculoIC(tipo) {
  document.getElementById("icTipoCalculo").value = tipo;
  document.getElementById("ic-display-text").textContent =
    "IC: " + (tipo === "media" ? "Média" : "Proporção");
  document.getElementById("ic-tipo-menu").style.display = "none";
  updateICFields();
}
