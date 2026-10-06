
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

function ocultarSecciones(){  
  document.getElementById("parametros").classList.remove("activa");  
  document.getElementById("clientes").classList.remove("activa");
}


function mostrarSeccion(id){
  ocultarSecciones();
    document.getElementById(id).classList.add("activa");
}


function guardarTasa(){
  let cmpTasaInteres = document.getElementById("tasaInteres");
  let tasa = parseInt(cmpTasaInteres.value);
  if (tasa >=10 && tasa <= 20) {
    console.log("Tasa configurada correctamente: "+tasa);
  }else{
    console.log("La tasa debe estar entre 10% y 20%");
  }
}


function guardarCliente(){
  let cedula = recuperaraTexto("txtCedula");  
  let nombre = recuperaraTexto("txtNombre");   
  let apellido = recuperaraTexto("txtApellido");   
  let ingreso = recuperarInt("txtIngreso");   
  let egreso = recuperarInt("txtEgreso");   

  //objeto cliente
  let cliente = {
        cedula: cedula,
        nombre: nombre,
        apellido: apellido,
        ingreso: ingreso,
        egreso: egreso
    };

  clientes.push(cliente);
  console.log(cedula);
  pintarClientes();
}


function pintarClientes(){
    let cmpTabla = document.getElementById("tablaClientes");
    let elementosCliente;
    let contenidoTabla = "<table>";    

    for (let i = 0; i < clientes.length; i++) {
        elementosCliente = clientes[i];
        contenidoTabla += "<tr>"+
                               "<td>"+ elementosCliente.cedula +"</td>"+
                               "<td>"+ elementosCliente.nombre +"</td>"+
                               "<td>"+ elementosCliente.apellido +"</td>"+
                               "<td>"+ elementosCliente. ingreso +"</td>"+
                               "<td>"+ elementosCliente.egreso +"</td>"+
                               "<td> <button>Actualizar</button> <button>Eliminar</button> </td>"+
                          "</tr>"
    }
    contenidoTabla += "</table>";
    cmpTabla.innerHTML = contenidoTabla;
}