
// MODO BÁSICO 


const display = document.getElementById("display");


function append(char) {

  display.textContent = display.textContent === "0"
    ? char
    : display.textContent + char;
}


function clearDisplay() {
  display.textContent = "0";
}


function calculate() {
  try {
  
    display.textContent = eval(display.textContent);
  } catch {
   
    display.textContent = "Erro";
  }
}




function rotateTo(faceIndex) {
  document.getElementById("cube").style.transform =
    `translateZ(-150px) rotateY(${faceIndex * -120}deg)`;
}







// TAMANHO DE AMOSTRA 
function calcSampleSize() {
 
  const tipo = document.getElementById("calculoTipo").value;
 
  const z = parseFloat(document.getElementById("z").value);
  const sigma = parseFloat(document.getElementById("sigma").value);
  const e = parseFloat(document.getElementById("e").value);
  
  const p = parseFloat(document.getElementById("pAmostra").value) || 0.5;
  
  const disp = document.getElementById("amostra-display-text");

 
  if (
    isNaN(z) ||
    isNaN(e) ||
    (tipo === "media" && isNaN(sigma)) ||
    (tipo === "proporcao" && isNaN(p))
  ) {
    disp.textContent = "Por favor, insira valores válidos.";
    return; 
  }

  let n;
  if (tipo === "media") {
   
    n = Math.pow((z * sigma) / e, 2);
  } else {
  
    n = (Math.pow(z, 2) * p * (1 - p)) / Math.pow(e, 2);
  }
 
  disp.textContent = `n ≈ ${Math.ceil(n)}`;
}


function clearSample() {
  ["z", "sigma", "e", "pAmostra"].forEach((id) => {
    document.getElementById(id).value = "";
  });
 
  document.getElementById("calculoTipo").value = "media";
  document.getElementById("amostra-display-text").textContent = "Amostra: Média";

  updateAmostraFields();
}



function calcConfidenceInterval() {
 
  const tipo = document.getElementById("icTipoCalculo").value;
  const displayText = document.getElementById("ic-display-text");

 
  const n = parseFloat(document.getElementById("n").value);
  const z = parseFloat(document.getElementById("z2").value);


  const mean = parseFloat(document.getElementById("mean").value);
  const stddev = parseFloat(document.getElementById("stddev").value);
  const p = parseFloat(document.getElementById("pIC").value);


  const okBase = !isNaN(n) && !isNaN(z);
  const okMedia = okBase && tipo === "media" && !isNaN(mean) && !isNaN(stddev);
  const okProp = okBase && tipo === "proporcao" && !isNaN(p);

  if (okMedia || okProp) {
    let margin, center;
    if (tipo === "media") {
   
      margin = z * (stddev / Math.sqrt(n));
      center = mean; 
    } else {
     
      margin = z * Math.sqrt((p * (1 - p)) / n);
      center = p;
    }
  
    const lower = (center - margin).toFixed(2);
    const upper = (center + margin).toFixed(2);
    
    displayText.textContent = `IC ≈ [${lower}, ${upper}]`;
  } else {
  
    displayText.textContent = `IC: ${tipo === "media" ? "Média" : "Proporção"}`;
  }
}


function clearIC() {
  ["mean", "stddev", "n", "z2", "pIC"].forEach((id) => {
    document.getElementById(id).value = "";
  });
  document.getElementById("icTipoCalculo").value = "media";
  document.getElementById("ic-display-text").textContent = "IC: Média";
  updateICFields();
}











function updateAmostraFields() {
  const tipo = document.getElementById("calculoTipo").value;
  document.getElementById("amostra-media-fields").style.display =
    tipo === "media" ? "block" : "none";
  document.getElementById("amostra-proporcao-fields").style.display =
    tipo === "proporcao" ? "block" : "none";
}


function updateICFields() {
  const tipo = document.getElementById("icTipoCalculo").value;
  document.getElementById("ic-media-fields").style.display =
    tipo === "media" ? "block" : "none";
  document.getElementById("ic-proporcao-fields").style.display =
    tipo === "proporcao" ? "block" : "none";
}



function toggleTipoCalculoAmostraMenu() {
  const menu = document.getElementById("amostra-tipo-menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}


function setTipoCalculoAmostra(tipo) {
  document.getElementById("calculoTipo").value = tipo;
  document.getElementById("amostra-display-text").textContent =
    "Amostra: " + (tipo === "media" ? "Média" : "Proporção");
  document.getElementById("amostra-tipo-menu").style.display = "none";
  updateAmostraFields();
}


function toggleTipoCalculoMenu() {
  const menu = document.getElementById("ic-tipo-menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}


function setTipoCalculoIC(tipo) {
  document.getElementById("icTipoCalculo").value = tipo;
  document.getElementById("ic-display-text").textContent =
    "IC: " + (tipo === "media" ? "Média" : "Proporção");
  document.getElementById("ic-tipo-menu").style.display = "none";
  updateICFields();
}
