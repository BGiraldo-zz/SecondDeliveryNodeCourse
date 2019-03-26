const express = require('express')
const app = express()
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const funciones = require('./funciones');
require('./helpers');

const directoriopublico = path.join(__dirname, '../public');
const directorioPartials = path.join(__dirname, '../partials');

// registra el directorio publico
app.use(express.static(directoriopublico));
// registra los partials
hbs.registerPartials(directorioPartials);
//Body parser
app.use(bodyParser.urlencoded({extended:false}));
//trae el motor del hbs
app.set('view engine', 'hbs');
// cambia el directorio de views por defecto
app.set('views', path.join(__dirname+'/..','views'));
//bootstrap config
const dirNode_modules = path.join(__dirname , '../node_modules')
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

// ---------------------------------------------------------- Requests

app.listen((3000), () => {
    console.log('escuchando por el puerto 3000');
});

//default
app.get('/', (req, res) => {
    res.render('index');
});

// --------------------------------------------------------  Coordinador

// cordinador request
app.get('/cordinador', (req, res) => {
    res.render('cordinador', {
        selectcursos: funciones.selectCursos(),
        cursos: funciones.listarCursos()
    });
});

app.post('/registrarcurso', (req, res) => {
    let curso = {
        id: parseInt(req.body.id),
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        valor: parseInt(req.body.valor),
        modalidad: req.body.modalidad,
        intensidad: parseInt(req.body.intensidad) | 0,
        estado: 'Disponible'
    }
    let respuesta = funciones.registrarCurso(curso);
    console.log(respuesta);
    res.render('mensaje', {  mensaje: respuesta });
});

app.post('/cerrarcurso', (req, res) => {
    console.log(req.body);
    let respuesta = funciones.cerrarCurso(parseInt(req.body.cursoid));
    res.render('mensaje', {  mensaje: respuesta });
});

app.post('/desinscribir', (req, res) => {
    let respuesta = funciones.desinscribir(parseInt(req.body.cursoid), parseInt(req.body.aspiranteid));
    res.render('mensaje', {  mensaje: respuesta });
});

// --------------------------------------------------------  Interesado

// Interesado request
app.get('/interesado', (req, res) => {
    res.render('interesado', {
        cursos: funciones.listarCursosDisponibles()
    });
});

// --------------------------------------------------------  Aspirante

// Aspirante request
app.get('/aspirante', (req, res) => {
    res.render('aspirante');
});

// Aspirante request
app.post('/registrarseacurso', (req, res) => {
    let registro = {
        cursoid: req.body.cursoid,
        id: req.body.id,
        nombre: req.body.nombre,
        email: req.body.email,
        telefono: req.body.telefono
    }
    let respuesta = funciones.registrarseCurso(registro);
    res.render('mensaje', { mensaje: respuesta});
});


// Error request
app.get('*', (req, res) => {
    res.render('error');
});