var nome = document.getElementById('nome');
var cognome = document.getElementById('cognome');
var addBtn = document.getElementById('scrivi');
var elencoHTML = document.getElementById('elenco');
var errore = document.getElementById('errore');
var erroreElenco = document.getElementById('erroreElenco');
var elenco = [];
var michaelJson;
var emptyBtn = document.getElementById("svuota");

window.addEventListener('DOMContentLoaded', init);

function init() {
	
	printData();
	eventHandler();
}

function eventHandler() {
	addBtn.addEventListener('click', function () {
		if (michaelJson) {
			overwrite(michaelJson)
		} else {
		controlla();
		}
	});
}

function printData() {
	fetch('http://localhost:3000/elenco')
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			elenco = data;
			if (elenco.length > 0) {
				errore.innerHTML = '';
				elencoHTML.innerHTML = '';
				elenco.map(function (element) {
					elencoHTML.innerHTML += `<li class="list-group-item list-group-item-action list-group-item-light d-flex justify-content-between align-items-center mb-2 rounded-pill">
					${element.nome} ${element.cognome}
					<div>
						<button type="button" class="btn btn-outline-warning me-1 rounded-circle" onClick="modifica(${element.id})"><i class="fa-regular fa-pen-to-square"></i></button>
						<button type="button" class="btn btn-outline-danger rounded-circle" onClick="elimina(${element.id})"><i class="fas fa-eraser"></i></button>
					</div>
					</li>`;
				});
			} else {
				erroreElenco.innerHTML = 'Nessun elemento presente in elenco';
			}
		});
}

function controlla() {
	if (nome.value != '' && cognome.value != '') {
		var data = {
			nome: nome.value,
			cognome: cognome.value,
		};
		addData(data);
	} else {
		errore.innerHTML = 'Compilare correttamente i campi!';
		return;
	}
}

async function addData(data) {
	let response = await fetch('http://localhost:3000/elenco', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify(data),
	});
	clearForm();
}

function clearForm() {
	nome.value = '';
	cognome.value = '';
}

function elimina(idNum) {
	if (confirm("Sei sicuro di voler cancellare?")==true) {
		fetch(`http://localhost:3000/elenco/${idNum}`, {
			method: 'DELETE'
		});
	}
}

function modifica(idNum) {
	fetch(`http://localhost:3000/elenco/${idNum}`)
	.then((response) => {
		return response.json();
	})
	.then((data) => {
		nome.value = data.nome;
		cognome.value = data.cognome;
	});
	
	return michaelJson = idNum;
}


function overwrite(idNum) {
	if (nome.value && cognome.value) {
	fetch(`http://localhost:3000/elenco/${idNum}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			"nome": nome.value,
			"cognome": cognome.value
		}),
	});
	clearForm();
	} else {
		errore.innerHTML = 'Compilare correttamente i campi!';
		return;
	}
}

emptyBtn.addEventListener("click", function svuota() {
	if (confirm("Sei sicuro di voler cancellare tutta la lista?") == true) {

		if (elenco.length == 0) {
			alert("L'elenco è già vuoto!");
			return;
		} else {
			elenco.forEach(element => {
				fetch(`http://localhost:3000/elenco/${element.id}`, {
					method: 'DELETE'
				})
			});
		}
	}
})