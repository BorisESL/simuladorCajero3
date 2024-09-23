/****************** TRANSACCIONES *****************/

class Transaccion {
    constructor(tipo, monto) {
        this.tipo = tipo;
        this.monto = Math.round(parseFloat(monto));
        this.fecha = new Date().toLocaleString();
    }

    mostrarDetalles() {
        return this.fecha + " - " + this.tipo + ": $" + this.monto.toFixed(2);
    }
}

/****************** VARIABLES GLOBALES *****************/

const pinCorrecto = "1234";
let saldo = 10000;
let intentos = 3;
let transacciones = [];


/****************** FUNCIONES PARA CARGAR DATOS *****************/
function cargarDatos() {
    const saldoGuardado = localStorage.getItem("saldo");
    const transaccionesGuardadas = localStorage.getItem("transacciones");
    
    if (saldoGuardado) {
        saldo = parseFloat(saldoGuardado);
    }
    
    if (transaccionesGuardadas) {
        transacciones = JSON.parse(transaccionesGuardadas).map(function(t) {
            return Object.assign(new Transaccion(), t);
        });
    }
}

/****************** FUNCIONES PARA GUARDAR DATOS *****************/
function guardarDatos() {
    localStorage.setItem("saldo", saldo.toString());
    localStorage.setItem("transacciones", JSON.stringify(transacciones));
}

/****************** FUNCIONES MOSTRAR MENSAJES *****************/
function mostrarMensaje(mensaje, tipo) {
    const mensajeElement = document.querySelector("#mensaje");
    mensajeElement.textContent = mensaje;
    mensajeElement.className = tipo;
    mensajeElement.style.display = "block";
    setTimeout(function() {
        mensajeElement.style.display = "none";
    }, 3000);
}

function actualizarSaldoMostrado() {
    document.querySelector("#saldoActual").textContent = "Saldo actual: $" + saldo.toFixed(2);
}

/****************** FUNCION PARA VALIDAR PIN  *****************/
function validarPin() {
    const pin = document.querySelector("#pin").value;
    if (pin === pinCorrecto) {
        document.querySelector("#login").style.display = "none";
        document.querySelector("#operaciones").style.display = "block";
        actualizarSaldoMostrado();
        return true;
    } else {
        intentos--;
        mostrarMensaje("Clave incorrecta. Le quedan " + intentos + " intentos restantes.", "error");
        document.querySelector("#pin").value = ""; // Limpiar el campo de PIN
        if (intentos === 0) {
            mostrarMensaje("Ha excedido el número de intentos. Contacte a su banco", "error");
            document.querySelector("#loginBtn").disabled = true;
            return false;
        }
    }
    return false;
}

/****************** FUNCIONES PARA REALIZAR OPERACIONES *****************/
function retiraDinero() {
    const montoInput = document.querySelector("#montoRetiro");
    montoInput.style.display = "block";
    montoInput.focus();
    montoInput.onchange = function() {
        let monto = Math.round(parseFloat(montoInput.value));
        if (monto <= 0 || isNaN(monto)) {
            mostrarMensaje("Monto inválido. Por favor ingrese un monto válido", "error");
        } else if (monto > saldo) {
            mostrarMensaje("Saldo insuficiente", "error");
        } else {
            saldo -= monto;
            transacciones.push(new Transaccion("Retiro", monto));
            actualizarSaldoMostrado();
            mostrarMensaje("Retiro exitoso. Saldo actual: $" + saldo.toFixed(2), "success");
            guardarDatos();
        }
        montoInput.value = "";
        montoInput.style.display = "none";
    };
}

function depositarDinero() {
    const montoInput = document.querySelector("#montoDeposito");
    montoInput.style.display = "block";
    montoInput.focus();
    montoInput.onchange = function() {
        let monto = Math.round(parseFloat(montoInput.value));
        if (monto <= 0 || isNaN(monto)) {
            mostrarMensaje("Monto inválido. Por favor ingrese un monto válido", "error");
        } else {
            saldo += monto;
            transacciones.push(new Transaccion("Depósito", monto));
            actualizarSaldoMostrado();
            mostrarMensaje("Depósito exitoso. Saldo actual: $" + saldo.toFixed(2), "success");
            guardarDatos();
        }
        montoInput.value = "";
        montoInput.style.display = "none";
    };
}

/****************** FUNCIONES PARA VER HISTORIAL *****************/
function verHistorial() {
    const historialDiv = document.querySelector("#historial");
    historialDiv.innerHTML = "<h2>Historial de transacciones</h2>";
    if (transacciones.length === 0) {
        historialDiv.innerHTML += "<p>No hay transacciones registradas</p>";
    } else {
        const lista = document.createElement("ul");
        transacciones.forEach(function(transaccion) {
            const item = document.createElement("li");
            item.textContent = transaccion.mostrarDetalles();
            lista.appendChild(item);
        });
        historialDiv.appendChild(lista);
    }
}

/****************** FUNCIONES PARA SALIR *****************/
function salir() {
    document.querySelector("#login").style.display = "block";
    document.querySelector("#operaciones").style.display = "none";
    document.querySelector("#historial").innerHTML = "";
    document.querySelector("#pin").value = "";
    intentos = 3;
    document.querySelector("#loginBtn").disabled = false;
    mostrarMensaje("Gracias por preferirnos. ¡Hasta pronto!", "success");
}

/****************** CONFIGURACION INICIAL *****************/
document.addEventListener("DOMContentLoaded", function() {
    cargarDatos();

    document.querySelector("#loginBtn").addEventListener("click", validarPin);
    document.querySelector("#retiroBtn").addEventListener("click", retiraDinero);
    document.querySelector("#depositoBtn").addEventListener("click", depositarDinero);
    document.querySelector("#historialBtn").addEventListener("click", verHistorial);
    document.querySelector("#salirBtn").addEventListener("click", salir);

    // Agregar evento para el enter en el campo de PIN
    document.querySelector("#pin").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            validarPin();
        }
    });
});