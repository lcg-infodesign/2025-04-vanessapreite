let data;
let vulcanoName;
let vulcanoRow;
let minEl, maxEl;

function preload() {
  // Carica il dataset CSV
  data = loadTable("assets/dataset.csv", "csv", "header");

  // Leggi parametro dalla query string
  const params = new URLSearchParams(window.location.search);
  vulcanoName = params.get("name") || "";
}

function setup() {
  noCanvas(); // Non serve canvas, solo HTML

  if (!vulcanoName) {
    createP("Nessun vulcano selezionato.");
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
    createP("Vulcano non trovato nel dataset.");
    return;
  }

  // Calcolo min/max elevazione per il colore dinamico
  let elevations = data.getColumn("Elevation (m)").map(v => parseFloat(v)).filter(v => !isNaN(v));
  minEl = min(elevations);
  maxEl = max(elevations);

  displayVulcanoDetails(vulcanoRow);
}

function displayVulcanoDetails(row) {
  // Container principale
  let container = createDiv().addClass("vulcano-container dynamic-color");

  // Calcola colore basato sull'elevazione
  let el = parseFloat(row.getString("Elevation (m)")) || 0;
  let h = map(el, minEl, maxEl, 200, 0); // come homepage
  let c = color(h, 90, 100);
  container.style("background-color", c.toString());

  // Nome vulcano come titolo
  createElement("h1", row.getString("Volcano Name")).parent(container);

  // Mostra tutti i campi del dataset come legenda
  let columns = data.columns;
  for (let col of columns) {
    if (col === "Volcano Name") continue; // nome già mostrato
    let value = row.getString(col) || "N/A";
    let p = createP("");
    p.parent(container);
    p.html(`<span class="field-label">${col}:</span> ${value}`);
  }
}
