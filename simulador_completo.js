
let clientes = [];
let creditos = [];
let tasaInteres = 15;
let clienteSeleccionado = null;
let cuotaCalculada = 0;
let montoCalculado = 0;
let plazoCalculado = 0;
let creditoAprobado = false;

//Para recuperar o mostrar información usar los métodos de la clase utilitarios, 
// puede agregar métodos adicionales en utilitarios

function ocultarSecciones() {
  document.getElementById("parametros").classList.remove("activa");
  document.getElementById("clientes").classList.remove("activa");
  document.getElementById("credito").classList.remove("activa");
  document.getElementById("contacto").classList.remove("activa");
  // ===== AGREGAR: Ocultar la nueva sección de historial
  document.getElementById("historial").classList.remove("activa");
}


function mostrarSeccion(id) {
  ocultarSecciones();
  document.getElementById(id).classList.add("activa");
}


function guardarTasa() {//tasas
  let cmpTasaInteres = document.getElementById("tasaInteres");
  let tasa = parseInt(cmpTasaInteres.value);
  if (tasa >= 10 && tasa <= 20) {
    console.log("Tasa configurada correctamente: " + tasa);
  } else {
    console.log("La tasa debe estar entre 10% y 20%");
  }
}


function guardarCliente() { 
  let cedula = recuperaraTexto("txtCedula");
  let nombre = recuperaraTexto("txtNombre");
  let apellido = recuperaraTexto("txtApellido");
  let ingreso = recuperarInt("txtIngreso");
  let egreso = recuperarInt("txtEgreso");
  let email = recuperaraTexto("txtEmail");

  let clienteExistente = buscarCliente(cedula) ;

  if (clienteExistente == null) {  

    //objeto cliente
    let cliente = {
      cedula: cedula,
      nombre: nombre,
      apellido: apellido,
      ingreso: ingreso,
      egreso: egreso,
      email: email
    };

    clientes.push(cliente);
    console.log(cedula);
    
    }else{
        console.log("Ya existe la cedula: "+clienteExistente.cedula);
        clienteExistente.nombre = nombre;
        clienteExistente.apellido = apellido;
        clienteExistente.ingreso = ingreso;
        clienteExistente.egreso = egreso;
        clienteExistente.email = email;
    }
  pintarClientes();  

  limpiar();

}


function pintarClientes() {
  let cmpTabla = document.getElementById("tablaClientes");
  let elementosCliente;
  let contenidoTabla = "<table>";

  for (let i = 0; i < clientes.length; i++) {
    elementosCliente = clientes[i];
    contenidoTabla += "<tr>" +
      "<td>" + elementosCliente.cedula + "</td>" +
      "<td>" + elementosCliente.nombre + "</td>" +
      "<td>" + elementosCliente.apellido + "</td>" +
      "<td>" + elementosCliente.ingreso + "</td>" +
      "<td>" + elementosCliente.egreso + "</td>" +
      "<td>" + elementosCliente.email + "</td>" +
      
       "<td><button onclick='seleccionarCliente(\"" + elementosCliente.cedula + "\")'>Actualizar</button> " +
            "<button onclick='eliminarCliente(\"" + elementosCliente.cedula + "\")'>Eliminar</button></td>" +
      "</tr>"
  }
  contenidoTabla += "</table>";
  cmpTabla.innerHTML = contenidoTabla;
}


function buscarCliente(cedula) {
  let elementosCliente;
  let clienteEncontrado = null;

  for (let i = 0; i < clientes.length; i++) {
    elementosCliente = clientes[i];
    if (elementosCliente.cedula == cedula) {
      clienteEncontrado = elementosCliente;
      break;
    }
  }
  return clienteEncontrado;
}


function seleccionarCliente(cedula){
  //cedula = recuperaraTexto("txtCedula");
  console.log("ENTRA A FUNCION "+cedula);
  let clienteSeleccionado = buscarCliente(cedula);

  if (clienteSeleccionado == null) {
    alert("Cedula no existe");
  } else {
    mostrarTextoEnCaja("txtCedula", clienteSeleccionado.cedula);
    mostrarTextoEnCaja("txtNombre", clienteSeleccionado.nombre);
    mostrarTextoEnCaja("txtApellido", clienteSeleccionado.apellido);
    mostrarTextoEnCaja("txtIngreso", clienteSeleccionado.ingreso);
    mostrarTextoEnCaja("txtEgreso", clienteSeleccionado.egreso);
  }
}


function limpiar(){
  mostrarTextoEnCaja("txtCedula", "");
  mostrarTextoEnCaja("txtNombre", "");
  mostrarTextoEnCaja("txtApellido", "");
  mostrarTextoEnCaja("txtIngreso", "");
  mostrarTextoEnCaja("txtEgreso", "");

   document.getElementById("txtCedula").focus();
}

//PARTE2 ***************************

function buscarClienteCredito(){
  let cedula = recuperaraTexto("buscarCedulaCredito");
   let clienteExistente = buscarCliente(cedula);
   console.log(clienteExistente);

   // si existe mostrar datos, si no mostrar mensaje
    if (clienteExistente != null) { 
      console.log("Ya existe la cedula: " + clienteExistente.cedula);    
      
      clienteSeleccionado = clienteExistente;
      pintarClienteCredito(clienteExistente);

    }else{
      alert("Cliente no existe");    
      clienteSeleccionado = null;  
    }   
    
}


function calcularCredito() {
 
  // monto y plazo del formulario
  let monto = recuperarFloat("montoCredito");
  let plazo = recuperarInt("plazoCredito");

  // validar campos
  if (isNaN(monto) || monto <= 0) {
    alert("Ingrese un monto mayor a 0");
    return;
  }

  if (isNaN(plazo) || plazo <= 0) {
    alert("Ingrese un plazo mayor a 0");
    return;
  }

  //guardar en variables globales
  montoCalculado = monto;
  plazoCalculado = plazo;

  // calcular cuota mensual
  let tasaMensual = tasaInteres / 100 / 12;
  let factor = Math.pow(1 + tasaMensual, plazo);
  cuotaCalculada = monto * (tasaMensual * factor) / (factor - 1);

  //capacidad de pago
  let capacidadPago = clienteSeleccionado.ingreso - clienteSeleccionado.egreso;

  //total a pagar
  let totalPagar = cuotaCalculada * plazo;

  //crédito es aprobado o no si cuota es menor o igual al 40%
  creditoAprobado = cuotaCalculada <= (capacidadPago * 0.40);

  //ver resultado
  mostrarResultadoCredito(capacidadPago, totalPagar);
}

//resultado del credito 
function mostrarResultadoCredito(capacidadPago, totalPagar) {
  let resultadoDiv = document.getElementById("resultadoCredito");
  let btnSolicitar = document.getElementById("btnSolicitarCredito");

  let html = `
    <div class="resultado-credito">
      <h3>Resultados del Simulador</h3>
      
      <div class="resultado-item">
        <strong>Capacidad de pago mensual:</strong> 
        <span>$${capacidadPago.toFixed(2)}</span>
        <small>(Ingresos: $${clienteSeleccionado.ingreso} - Egresos: $${clienteSeleccionado.egreso})</small>
      </div>

      <div class="resultado-item">
        <strong>Cuota mensual calculada:</strong> 
        <span class="cuota">$${cuotaCalculada.toFixed(2)}</span>
      </div>

      <div class="resultado-item">
        <strong>Total a pagar (${plazoCalculado} meses):</strong> 
        <span>$${totalPagar.toFixed(2)}</span>
      </div>

      <div class="resultado-item">
        <strong>Interés total:</strong> 
        <span>$${(totalPagar - montoCalculado).toFixed(2)}</span>
      </div>

      <div class="resultado-aprobacion ${creditoAprobado ? 'aprobado' : 'rechazado'}">
        <h4> Resultado del crédito:</h4>
        <p>${creditoAprobado 
          ? 'CRÉDITO APROBADO - La cuota es adecuada para su capacidad de pago' 
          : ' CRÉDITO RECHAZADO - La cuota supera el 40% de su capacidad de pago'}</p>
      </div>
    </div>
  `;

  resultadoDiv.innerHTML = html;

  // activa o desactiva botón solicitar
  btnSolicitar.disabled = !creditoAprobado;

  
  // ===== AGREGAR: Controlar el NUEVO botón "Asignar Crédito"
    let btnAsignar = document.getElementById("btnAsignarCredito");
    if (creditoAprobado) {
        btnAsignar.disabled = false; // Se habilita si fue aprobado
    } else {
        btnAsignar.disabled = true;  // Se mantiene deshabilitado si fue rechazado
    }


}


//mostrar los datos del cliente
function pintarClienteCredito(cliente) {
  let cmpTabla = document.getElementById("datosClienteCredito");
  
  let contenidoTabla = "<table>" +
    "<tr>" +
    "<th> Cédula </th>" +
    "<th> Nombre </th>" +
    "<th> Apellido </th>" +
    "<th> Ingresos </th>" +
    "<th> Egresos </th>" +
    "</tr>" +
    "<tr>" +
    "<td>" + cliente.cedula + "</td>" +
    "<td>" + cliente.nombre + "</td>" +
    "<td>" + cliente.apellido + "</td>" +
    "<td>$ " + cliente.ingreso + "</td>" +
    "<td>$ " + cliente.egreso + "</td>" +
    "</tr>" +
    "</table>";

  cmpTabla.innerHTML = contenidoTabla;
}



// ==== AGREGAR: Función para el botón "Asignar Crédito" (PASO 2)
function asignarCredito() {
    // 1. Validar que el crédito esté aprobado
    if (!creditoAprobado) {
        alert("El crédito fue rechazado, no se puede asignar.");
        return;
    }

    // 2. Crear el objeto con la estructura exacta que pide el taller
    let credito = {
        cedula: clienteSeleccionado.cedula,
        nombre: clienteSeleccionado.nombre,
        apellido: clienteSeleccionado.apellido,
        monto: montoCalculado,
        tasa: tasaInteres,
        plazo: plazoCalculado,
        cuota: cuotaCalculada
    };

    // 3. Agregar el nuevo objeto al arreglo creditos
    creditos.push(credito);

    // 4. Mostrar confirmación y verificar en consola
    alert("✅ Crédito asignado exitosamente a " + clienteSeleccionado.nombre);
    console.log("Arreglo de créditos actualizado:", creditos);
}



// ===== PASO 4: FUNCIÓN BUSCAR CRÉDITOS =====
function buscarCreditos(cedula) {
    // Arreglo vacío para guardar los créditos encontrados
    let creditosEncontrados = [];
    
    // Recorrer el arreglo de todos los créditos
    for (let i = 0; i < creditos.length; i++) {
        // Si la cédula del crédito coincide con la cédula buscada
        if (creditos[i].cedula === cedula) {
            // Agregar ese crédito al arreglo de encontrados
            creditosEncontrados.push(creditos[i]);
        }
    }
    
    // Retornar el arreglo con los créditos encontrados (puede estar vacío)
    return creditosEncontrados;
}



// ===== PASO 5: FUNCIÓN PINTAR CRÉDITOS =====
function pintarCreditos(listaCreditos) {
    // Obtener el contenedor de la tabla
    let contenedor = document.getElementById("tablaCreditos");
    
    // Validar si el arreglo está vacío
    if (listaCreditos.length === 0) {
        contenedor.innerHTML = `
            <p style="text-align:center; color:#ef4444; padding:20px;">
                ❌ No se encontraron créditos registrados
            </p>`;
        return;
    }
    
    // Construir la tabla HTML dinámicamente
    let contenidoTabla = "<table>";
    
    // Encabezado de la tabla
    contenidoTabla += `
        <thead>
            <tr>
                <th>Cédula</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Monto</th>
                <th>Tasa</th>
                <th>Plazo</th>
                <th>Cuota</th>
            </tr>
        </thead>
        <tbody>
    `;
    
    // Recorrer el arreglo de créditos y crear una fila por cada crédito
    for (let i = 0; i < listaCreditos.length; i++) {
        let credito = listaCreditos[i];
        
        contenidoTabla += `
            <tr>
                <td>${credito.cedula}</td>
                <td>${credito.nombre}</td>
                <td>${credito.apellido}</td>
                <td>$${credito.monto.toFixed(2)}</td>
                <td>${credito.tasa}%</td>
                <td>${credito.plazo} meses</td>
                <td>$${credito.cuota.toFixed(2)}</td>
            </tr>
        `;
    }
    
    // Cerrar la tabla
    contenidoTabla += `
        </tbody>
    </table>
    <p style="text-align:right; margin-top:10px; color:#64748b;">
        Total de créditos: <strong>${listaCreditos.length}</strong>
    </p>
    `;
    
    // Insertar el HTML en el contenedor
    contenedor.innerHTML = contenidoTabla;
}



// ===== PASO 6: FUNCIÓN BUSCAR CRÉDITOS CLIENTE =====
function buscarCreditosCliente() {
    // 1. Tomar el valor de la cédula desde la caja de texto
    let cedula = document.getElementById("buscarCedulaListado").value.trim();
    
    // 2. Validar que no esté vacío
    if (cedula === "") {
        alert("⚠️ Por favor ingrese una cédula para buscar");
        return;
    }
    
    // 3. Invocar la función buscarCreditos
    let creditosEncontrados = buscarCreditos(cedula);
    
    // 4. Enviar el resultado a la función pintarCreditos
    pintarCreditos(creditosEncontrados);
}