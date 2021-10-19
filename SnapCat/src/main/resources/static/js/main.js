'use strict';

//#region Funciones botón enviar

var customFile = document.querySelector('#customFile');
var singleFileUploadError = document.querySelector('#singleFileUploadError');
var singleFileUploadSuccess = document.querySelector('#singleFileUploadSuccess');

function uploadSingleFile(descripcion, name, genero, nacimiento, file) {
    console.log("upload");
    var formData = new FormData();

    formData.append("file", file);

    console.log("3 desc: " + descripcion + " name: " + name + " gen: " + genero + " nac: " + nacimiento);

    formData.append("descripcion", descripcion);
    formData.append("name", name);
    formData.append("genero", genero);
    formData.append("nacimiento", nacimiento);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/uploadFile");

    xhr.onload = function () {
        console.log(xhr.responseText);
        var response = JSON.parse(xhr.responseText);
        if (xhr.status == 200) {
            singleFileUploadError.style.display = "none";
            singleFileUploadSuccess.innerHTML = "Imagen subida correctamente.";

            clearBoxes();
            singleFileUploadSuccess.style.display = "block";
        } else {
            singleFileUploadSuccess.style.display = "none";
            singleFileUploadError.innerHTML = (response && response.message) || "Hubo un error al subir el archivo :(";
        }
    }
    xhr.send(formData);
}

document.getElementById("enviar").addEventListener("click", function () {
    var files = customFile.files;

    console.log("listener2");

    singleFileUploadSuccess.innerHTML = "";

    console.log("1 desc: " + descripcion + " name: " + name + " gen: " + genero + " nac: " + nacimiento);

    var descripcion = document.getElementById('descripcion').value;
    var name = document.getElementById('name').value;
    var genero = document.getElementById('genero').value;
    var nacimiento = document.getElementById('nacimiento').value;

    console.log("2 desc: " + descripcion + " name: " + name + " gen: " + genero + " nac: " + nacimiento);

    if (files.length === 0) {
        singleFileUploadError.innerHTML = "Por favor elije un archivo";
        singleFileUploadError.style.display = "block";
    }

    uploadSingleFile(descripcion, name, genero, nacimiento, files[0]);
    //event.preventDefault();  
});

//#endregion



function cargarFotos() {
    let container = document.getElementById('cascada'); //Container para cargar las imágenes
    var bloque = "";

    var formData = new FormData();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/get");

    xhr.onload = function () {

        var response = JSON.parse(xhr.responseText);
        if (xhr.status == 200) {
            container.innerHTML = "";

            // banderas / contadores
            let cantColumnas = 4;
            let filas = Math.ceil(response.length / cantColumnas);
            let datosFlag = 0;
            let card = "";

            for (let i = 0; i < filas; i++) {
                let fila = '<div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">\n';

                let aux = 0;
                while (aux < cantColumnas) {
                    if (datosFlag < response.length) {
                        //console.log("Response: ")
                        var fecPub = getPublicado(response[datosFlag].date_entry);
                        //#region  div carta
                        card = '    <div class="col"> \n';
                        card += '       <div class = "card shadow-sm"> \n';
                        card += '           <img src="data:' + response[datosFlag].fileType + ';base64,' + response[datosFlag].data;
                        card += '" class="card-img" width="100%" height="280" > \n';
                        card += '           <div class ="card-body"> \n';
                        card += '               <h5 class ="card-title"> ' + response[datosFlag].name + ' </h5> \n';
                        card += '               <p class ="card-text"> ' + response[datosFlag].descripcion + ' </p> \n';
                        card += '               <div class ="d-flex justify-content-between align-items-center"> \n';
                        card += '                   <div class ="btn-group" id="' + response[datosFlag].id + '"> \n';
                        card += '                       <button type ="button" id="verInfo" class ="btn btn-sm btn-outline-secondary"';
                        card += ' data-bs-toggle="modal" data-bs-target="#modalVer" >Ver</button> \n';
                        //'                     <button type ="button" class ="btn btn-sm btn-outline-secondary">Edit</button> \n'+
                        card += '                   </div> \n';
                        card += '                   <small class ="text-muted"> ' + fecPub + ' </small> \n'; //tiempo de publicado
                        card += '               </div> \n';
                        card += '           </div> \n';
                        card += '       </div> \n';
                        card += '   </div>\n';
                        //#endregion
                        console.log(response[datosFlag].responseURL);
                        fila += card + "\n";
                        datosFlag++;
                    }
                    aux++;
                }

                fila += '</div> </br>\n\n';
                bloque += fila + "\n";
                //container.innerHTML = bloque;

            }
            container.innerHTML = bloque;
        } else {
            singleFileUploadError.innerHTML = (response && response.message) || "Ocurrió un error al cargar las imágenes";
        }
    }
    xhr.send(formData);
}


if (document.addEventListener) {
    document.addEventListener("click", handleClick, false);
}
else if (document.attachEvent) {
    document.attachEvent("onclick", handleClick);
}

function handleClick(event) {
    event = event || window.event;
    var element = event.target;

    if (element.id === "verInfo" && element.nodeName === "BUTTON") {
        verInformacion(element.parentNode.id);
    }
}

function verInformacion(id) {
    let formData = new FormData();
    let xhr = new XMLHttpRequest();
    let ruta = "/cargarForm/" + id;
    xhr.open("GET", ruta);

    xhr.onload = function () {
        if (xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);


            document.getElementById("verTitulo").innerHTML = "¡Conoce a " + response.name + "!";
            document.getElementById("catoName").value = response.name;
            document.getElementById("catoGen").value = response.genero;
            document.getElementById("catoAge").value = getAge(response.nacimiento);
            document.getElementById("catoDesc").value = response.descripcion;

            document.getElementById("catoFoto").src = 'data:' + response.fileType + ';base64,' + response.data;
        } else {
            singleFileUploadError.innerHTML = (response && response.message) || "Ocurrió un error al cargar la vista";
        }
    }

    xhr.send(formData);
}


function getAge(dateString) {
    let today = new Date();
    let strDate = (dateString).split("-");
    let birthDate = new Date(strDate[0],strDate[1],strDate[2],);

    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    let d = today.getDate() - birthDate.getDate();
    //console.log(age + " - "+ m + " - "+ d);
    let edad = age + " año(s)";

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
        edad = age + " año(s)";
        
    }
    if (age <= 0 && m > 0) {
        return m + " mes(es)";
    }
    else if (age <= 0 && m <= 0){
        return d + " día(s)";
    }
    return edad;
}

function getPublicado(date_entry) {

    let fechaReg = new Date(date_entry.slice(0, -10));
    let fechaActual = new Date();
    fechaActual = new Date(fechaActual.getUTCFullYear(), fechaActual.getUTCMonth(), fechaActual.getUTCDate(),
        fechaActual.getUTCHours(), fechaActual.getUTCMinutes(), fechaActual.getUTCSeconds());

    let diferencia = Math.abs(fechaActual - fechaReg);

    if ((diferencia / 1000) < 60) {
        return (Math.round((diferencia / 1000))) + "s";

    } else if ((diferencia / 60000) < 60) { //minutos
        return (Math.round((diferencia / 60000))) + "m";

    } else if ((diferencia / 3600000) < 24) { //horas
        return (Math.round((diferencia / 3600000))) + "h";

    } else {
        return (Math.round((diferencia / 86400000))) + "d";
    }
}

function clearBoxes() {
    document.getElementById('descripcion').value = '';
    document.getElementById('name').value = '';
    document.getElementById('genero').value = '';
    document.getElementById('nacimiento').value = '';
    var fileBox = document.getElementById("customFile");
    fileBox.value = fileBox.defaultValue;
}