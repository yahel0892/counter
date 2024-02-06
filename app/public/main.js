// Limpiar el almacenamiento local antes de que la página se cierre
/* window.addEventListener('beforeunload', function() {
    localStorage.removeItem('dataTable');
});  */

const socket = io();

// Inicializa el valor del contador desde el servidor
socket.on('contador', (valor) => {
    document.getElementById('contador').innerText = valor;
});

// Agrega un listener al botón para generar una guía
document.getElementById('generarGuia').addEventListener('click', () => {
    document.getElementById('loadingIndicator').style.display = 'inline-block';

    fetch('/generar-guia', { method: 'GET' })
    .then(data => {
        // Emite el evento 'generarGuia' al servidor
        socket.emit('generarGuia');
        
        console.log('Guía generada con éxito. Nuevo contador:', data);
        // Mostrar alerta de éxito
        fetch('/guides', { method: 'GET'})
        .then(response =>{
            if (!response.ok) {
            throw new Error(`Error de red: ${response.status}`);
            }
            return response.json();
        })
        .then(guides =>{
            console.log(guides)
            document.getElementById('loadingIndicator').style.display = 'none';

            // Iterar sobre cada objeto en el arreglo y aplicar la función
            guides.forEach(objeto => {
            formatObjectForHTML(objeto);
            });

            // Llama a la función para actualizar la tabla con la nueva guía
            updateTable(guides);
            // Actualiza los datos de la tabla en localStorage
            updateLocalStorage();
        })
        .catch(error => {
            console.error('Error en la solicitud:', error.message);
        });
    })
    .catch(error => {
        console.error('Error en la solicitud:', error.message);
    });
});

function formatObjectForHTML(objeto) {
    for (const key in objeto) {
    if (objeto.hasOwnProperty(key) && typeof objeto[key] === 'string' && key !== 'guide') {
        let index = objeto[key].indexOf(',')
        objeto[key] = objeto[key].replace(/,/, '\n')
    }
    }
}

// Función para agregar una nueva guía a la tabla
function updateTable(guides) {
    const tabla = document.getElementById('tablaGuias').getElementsByTagName('tbody')[0];

    // Limpia la tabla antes de agregar nuevas filas
    tabla.innerHTML = '';

    // Recorre el arreglo de guías y agrega una fila por cada guía
    guides.forEach((guia) => {
    // Crea una nueva fila y agrega celdas con los datos de la guía
    let row = document.createElement('tr');
    let followUp = document.createElement('td');
    followUp.textContent = guia.followUp;
    row.appendChild(followUp);

    let status = document.createElement('td');
    status.textContent = guia.status;
    row.appendChild(status);

    let origin = document.createElement('td');
    origin.textContent = guia.origin;
    row.appendChild(origin);

    let destination = document.createElement('td');
    destination.textContent = guia.destination;
    row.appendChild(destination);

    let package = document.createElement('td');
    package.textContent = guia.package;
    row.appendChild(package);

    let guide = document.createElement('td');
    guide.textContent = guia.guide;
    row.appendChild(guide);

    let user = document.createElement('td');
    user.textContent = guia.user;
    row.appendChild(user);
    // Agrega la fila al cuerpo de la tabla
    tabla.appendChild(row);
    })
}

// Función para actualizar los datos de la tabla en localStorage
function updateLocalStorage() {
    const table = document.getElementById('tablaGuias');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var dataTable = [];

    // Recorre las filas y almacena los datos en un array
    for (let i = 0; i < rows.length; i++) {
    let cells = rows[i].getElementsByTagName('td');
    let dataRow = {
        followUp: cells[0].textContent,
        status: cells[1].textContent,
        origin: cells[2].textContent,
        destination: cells[3].textContent,
        package: cells[4].textContent,
        guide: cells[5].textContent,
        user: cells[6].textContent
    };
    dataTable.push(dataRow);
    }

    // Almacena los datos en localStorage
    localStorage.setItem('dataTable', JSON.stringify(dataTable));
}

// Función para cargar los datos de la tabla desde localStorage al cargar la página
function uploadDataLocalStorage() {
    const dataTableString = localStorage.getItem('dataTable');

    if (dataTableString) {
    const dataTable = JSON.parse(dataTableString);
    updateTable(dataTable);
    }
}

// Llama a la función para cargar los datos al cargar la página
uploadDataLocalStorage();
//localStorage.removeItem('dataTable');
