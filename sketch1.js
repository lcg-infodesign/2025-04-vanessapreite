let data;
let vulcanoName;
let vulcanoRow;

function preload() {
  // Carica il dataset CSV
  data = loadTable("assets/dataset.csv", "csv", "header");

  // Leggi parametro dalla query string
  const params = new URLSearchParams(window.location.search);
  vulcanoName = params.get("name") || "";
}

function setup() {
  noCanvas(); // Non serve canvas, solo HTML

  // Sfondo nero
  select('body').style('background-color', '#000');

  if (!vulcanoName) {
    createP("Nessun vulcano selezionato.").style("color", "#fff");
    return;
  }

  // Trova la riga del vulcano cliccato
  vulcanoRow = null;
  for (let r = 0; r < data.getRowCount(); r++) {
    if (data.getString(r, "Volcano Name") === vulcanoName) {
      vulcanoRow = data.getRow(r);
      break;
    }
  }

  if (!vulcanoRow) {
    createP("Vulcano non trovato nel dataset.").style("color", "#fff");
    return;
  }

  displayVulcanoDetails(vulcanoRow);
}

function displayVulcanoDetails(row) {
  // Container principale
  let container = createDiv().addClass("vulcano-container dynamic-color");
  container.style("background-color", "rgba(40, 40, 40, 0.6)");

  // Titolo
  createElement("h1", row.getString("Volcano Name"))
    .parent(container)
    .style("color", "#ff3333");

  // Mostra tutti i campi
  let columns = data.columns;
  for (let col of columns) {
    if (col === "Volcano Name") continue;
    let value = row.getString(col) || "N/A";

    let p = createP("").parent(container);
    p.html(`<span class="field-label">${col}:</span> <span class="field-value">${value}</span>`);

    // Testo bianco e normale
    p.style("color", "#fff");
    p.style("font-weight", "normal");

    // Hover luminoso
    p.mouseOver(() => {
      p.style("color", "#ffffaa");
      p.style("text-shadow", "0 0 8px #ffffaa");
      p.style("transform", "translateX(3px)");
    });
    p.mouseOut(() => {
      p.style("color", "#fff");
      p.style("text-shadow", "none");
      p.style("transform", "translateX(0px)");
    });
  }

  // Pulsante Indietro
  let btn = createButton("← Torna Indietro").parent(container);
  btn.style("margin-top", "20px");
  btn.style("padding", "10px 20px");
  btn.style("font-size", "16px");
  btn.style("border-radius", "6px");
  btn.style("border", "none");
  btn.style("cursor", "pointer");
  btn.style("background-color", "#ff3333");
  btn.style("color", "#fff");
  btn.mouseOver(() => btn.style("background-color", "#ff5555"));
  btn.mouseOut(() => btn.style("background-color", "#ff3333"));
  btn.mousePressed(() => window.history.back());

  // Centra container
  container.style("margin", "auto");
}
