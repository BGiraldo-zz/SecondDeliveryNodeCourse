const fs = require('fs');
const path = require('path');
listaDeCursos = [];
listaDeAspirantes = [];
listaDeAspiranteCurso = [];

const directorioData = path.join(__dirname, '../data');

const guardarCursos = () => {
    fs.writeFile(directorioData + '/cursos.json', JSON.stringify(listaDeCursos), (err) => {
        if (err) throw (err);
    });
}

const guardarAspiranteCurso = () => {
    fs.writeFile(directorioData + '/aspirantecurso.json', JSON.stringify(listaDeAspiranteCurso), (err) => {
        if (err) throw (err);
    });
}

const guardarAspirantes = () => {
    fs.writeFile(directorioData + '/aspirantes.json', JSON.stringify(listaDeAspirantes), (err) => {
        if (err) throw (err);
    });
}

const cargarCursos = () => {
    try {
        listaDeCursos = require(directorioData + '/cursos.json');
    } catch (error) {
        listaDeCursos = [];
    }
}

const cargarAspirantes = () => {
    try {
        listaDeAspirantes = require(directorioData + '/aspirantes.json');
    } catch (error) {
        listaDeAspirantes = [];
    }
}

const cargarAspiranteCurso = () => {
    try {
        listaDeAspiranteCurso = require(directorioData + '/aspirantecurso.json');
    } catch (error) {
        listaDeAspiranteCurso = [];
    }
}

const buscarCurso = (cursoid) => {
    cargarCursos();
    return listaDeCursos.find(curso => curso.id == cursoid);
}

const registrarCurso = (curso) => {
    cargarCursos();
    let duplicado = listaDeCursos.find(cur => cur.id == curso.id);
    if (!duplicado) {
        listaDeCursos.push(curso);
        guardarCursos();
        return `<div class="alert alert-success" role="alert">ha sido registrado el curso</div>`;
    } else {
        return `<div class='alert alert-danger' role='alert'>\
         Ya existe un curso registrado con el id ${curso.id} \
         </div>`;
    }
}

const listarCursos = () => {
    cargarCursos();
    texto = `<table class="table">
    <thead class="thead-dark">
        <tr>
          <th>ID</th>
          <th>Nombre</th> 
          <th>Descripcion</th>
          <th>Valor</th>
          <th>Modalidad</th>
          <th>Intensidad</th>
          <th>Estado</th>
        </tr>
    </thead>`
    listaDeCursos.forEach(curso => {
        texto = texto + `
        <tr>
            <td>${curso.id}</td>
            <td>${curso.nombre}</td> 
            <td>${curso.descripcion}</td>
            <td>${curso.valor}</td>
            <td>${curso.modalidad}</td>
            <td>${curso.intensidad}</td>
            <td>${curso.estado}</td>
        </tr>`
    });
    texto = texto + `</table>`
    return texto;
}

const verAspirantes = (cursoid) => {
    cargarCursos();
}

const selectCursos = () => {
    cargarCursos();
    let cursosDisponibles = listaDeCursos.filter(curso => curso.estado != 'Cerrado');
    texto = `<form action="/cerrarcurso" method="POST">
     <div class="form-group">
         <label for="cursoselect">Curso</label>
            <select class="form-control" id="cursoselect" name="cursoid">`
    cursosDisponibles.forEach(curso => {
        texto = texto + `<option value="${curso.id}">${curso.nombre} - ID: ${curso.id}</option>`
    });
    texto = texto + `
            </select>
        </div>
        <button class="btn btn-primary" type="submit">Cerrar Curso</button>
    </form>`
    return texto;
}

const cerrarCurso = (cursoid) => {
    cargarCursos();
    let curso = buscarCurso(cursoid);
    if (curso) {
        curso.estado = 'Cerrado';
        guardarCursos();
        return `<div class="alert alert-success" role="alert">ha sido cerrado el curso</div>`;
    } else {
        return `<div class='alert alert-danger' role='alert'>No existe el curso con id ${cursoid}</div>`;
    }
}

const listarCursosDisponibles = () => {
    cargarCursos();
    let cursosDisponibles = listaDeCursos.filter(curso => curso.estado != 'Cerrado');
    texto = `<div style="margin-left: 50px; display:flex; flex-flow:row wrap; justify-content: space-around;">`
    i = 0;
    cursosDisponibles.forEach(curso => {
        texto = texto + `
        <p>
            <button class="btn btn-primary" type="button" data-toggle="collapse" 
            data-target="#collap${i}" aria-expanded="false" aria-controls="#collap${i}">
              <p>Nombre: ${curso.nombre}</p>
              <p>Descripción: ${curso.descripcion}</p>
              <p>Valor: ${curso.valor} COP</p>
            </button>
        </p>
        <div class="collapse" id="collap${i}">
            <p>Descripción: ${curso.descripcion}</p>
            <p>Modalidad: ${curso.modalidad}</p>
            <p>Intensidad Horaria: ${curso.intensidad} Horas c/d </p>
        </div>`
        i = i + 1;
    });
    texto = texto + `</div>`
    return texto;
}

const obtenerCursosDisponibles = () => {
    cargarCursos();
    return listaDeCursos.filter(curso => curso.estado != 'Cerrado');
}

const registrarseCurso = (registro) => {
    cargarAspirantes();
    cargarAspiranteCurso();

   // let aspiranteDuplicado = listaDeAspirantes.find(asp => asp.id == registro.id);

  //  if (!aspiranteDuplicado) {

        let aspiranteCursoDuplicado = listaDeAspiranteCurso.find(aspc => aspc.cursoid == registro.cursoid &
            aspc.aspiranteid == registro.id);
        if (!aspiranteCursoDuplicado) {
            let aspirantecurso = {
                cursoid: registro.cursoid,
                aspiranteid: registro.id
            }
            listaDeAspiranteCurso.push(aspirantecurso);

            let aspirante = {
                id: registro.id,
                nombre: registro.nombre,
                email: registro.email,
                telefono: registro.telefono
            }
            listaDeAspirantes.push(aspirante);

            guardarAspiranteCurso();
            guardarAspirantes();

            return `<div class="alert alert-success" role="alert">ha sido registrado adecuadamente</div>`;
        } else {
            return `<div class='alert alert-danger' role='alert'>
         Ya existe un aspirante con identificador ${registro.id} registrado al curso 
         </div>`;
        }
 /*   } else {
        return `<div class='alert alert-danger' role='alert'>\
         Ya existe un aspirante registrado con el id ${registro.id} \
         </div>`;
    }*/
}

const obtenerAspirantesCurso = (cursoid) => {
    cargarAspirantes();
    cargarAspiranteCurso();
    listaDeAspirantesEnCurso = [];
    let aspirantesCurso = listaDeAspiranteCurso.filter(aspc => aspc.cursoid == cursoid);
    aspirantesCurso.forEach(aspc => {
        let aspirante = listaDeAspirantes.find(asp => asp.id == aspc.aspiranteid);
        listaDeAspirantesEnCurso.push(aspirante);
    });
    tablaAspirantes = `<form action="/desinscribir" method="POST">
    <table class="table">
    <thead class="thead-dark">
        <tr>
          <th>ID</th>
          <th>Nombre</th> 
          <th>Email</th>
          <th>Telefono</th>
          <th>Quitar</th>
        </tr>
    </thead>`
    listaDeAspirantesEnCurso.forEach(aspc => {
        tablaAspirantes = tablaAspirantes + `
        <tr>
            <td>${aspc.id}</td>
            <td>${aspc.nombre}</td> 
            <td>${aspc.email}</td>
            <td>${aspc.telefono}</td>
            <td>
                
                    <input type="number" style="display:none;visibility:hidden;" name="cursoid" value="${cursoid}"></input>
                    <input type="number" style="display:none;visibility:hidden;" name="aspiranteid" value="${aspc.id}"></input>
                    <button type="submit" class="btn btn-danger">Eliminar</button>
               
            </td>
        </tr>`
    });
    tablaAspirantes = tablaAspirantes + `</table><form>`
    return tablaAspirantes;
}

const veraspirantes = () => {
    cargarCursos();
    let cursosDisponibles = listaDeCursos.filter(curso => curso.estado != 'Cerrado');
    htmlCursoAspirantes = `<div style="margin-left: 50px; display:flex; flex-flow:row wrap; justify-content: space-around;">`
    i = 0;
    cursosDisponibles.forEach(curso => {
        let aspirantesEnCurso = obtenerAspirantesCurso(curso.id);
        htmlCursoAspirantes = htmlCursoAspirantes + `
        <p>
            <button class="btn btn-primary" type="button" data-toggle="collapse" 
            data-target="#colla${i}" aria-expanded="false" aria-controls="#colla${i}">
              <p>${curso.nombre} ID:${curso.id}</p>
            </button>
        </p>
        <div class="collapse" id="colla${i}">` +
            aspirantesEnCurso +
            `</div>`
        i = i + 1;
    });

    htmlCursoAspirantes = htmlCursoAspirantes + `</div>`
    return htmlCursoAspirantes;
}

const desinscribir = (cursoid, aspiranteid) => 
{
    cargarAspiranteCurso();
   // let listAspiranteCurso = listaDeAspiranteCurso.filter(aspc => aspc.cursoid != cursoid & aspc.aspiranteid != aspiranteid);
    
    for (let i = 0; i < listaDeAspiranteCurso.length; i++) {
        let aspc = listaDeAspiranteCurso[i];
        if(aspc.cursoid == cursoid & aspc.aspiranteid == aspiranteid){
            listaDeAspiranteCurso.splice(i, 1);
            guardarAspiranteCurso();
            break;
        }
            
    }

    //console.log(listAspiranteCurso);
   // if(listaDeAspiranteCurso.length != listAspiranteCurso.length){
        //listaDeAspiranteCurso = listAspiranteCurso;
       /* cargarAspirantes();
        let aspirants = listaDeAspirantes.filter(asp => asp.id != aspiranteid);
        listaDeAspirantes = aspirants;
        guardarAspirantes();
        return `<div class="alert alert-success" role="alert">ha sido eliminado correctamente</div>`;
 }else{
        return `<div class='alert alert-danger' role='alert'>
        Ha ocurrido un error al eliminar el aspirante del curso
        </div>`;
    }*/
}

module.exports = {
    registrarCurso,
    listarCursos,
    selectCursos,
    cerrarCurso,
    listarCursosDisponibles,
    obtenerCursosDisponibles,
    registrarseCurso,
    veraspirantes,
    desinscribir
}