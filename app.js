var express = require('express');
var compression = require('compression');
var expiry = require('static-expiry');
var minify = require('express-minify');
var minifyHTML = require('express-minify-html');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var apicache = require('apicache');

//libreria cargar archivos al servidor
var fileUpload = require('express-fileupload');

//Libreria para variables de session
var session = require('express-session');

//son los archivo en el server lo controlara cada pagina
var users = require('./routes/consultaUsuario'); //consulta el usuario
var validar = require('./routes/validarestart'); //validar el usuario para recuperar contraseña
var indicater = require('./routes/indicadores'); //pagina de bienvenida
var recover = require('./routes/recover'); //para recuperar contraseña
var logout = require('./routes/logout'); //pagina de logout
var tutorial = require('./routes/tutorial'); //pagina de manual y video explicativo

//para controlar todo lo del KPI satisfaccion
var satisfaction = require('./routes/satisfaccion'); //pagina del indicador de satisfaccion
var filter = require('./routes/consultaFiltrosSatisfaccion'); //consulta filtros para satisfaccion
var consultation = require('./routes/consultaSatisfaccion'); //consulta datos iniciales desatisfaccion por get y con filtros por POST
var uploadfilesatisfaccion = require('./routes/uploadfilesatisfaccion') //maneja carga de archivo de datos satisfaccion

//para controlar todo lo del KPI desercion periodo
var consultationperiod = require('./routes/consultaperiodo'); //consulta los datos iniciales de desercion por periodo
var filterperiod = require('./routes/consultafiltrosPeriodo');//para cargar las listas de filtros periodo
var period = require('./routes/periodo'); //pagina inicial de desercion periodo
var uploadfileperiod = require('./routes/uploadfileperiodo') //maneja carga de archivo cohorte

//para controlar todo lo del KPI desercion por cohorte
var cohorte = require('./routes/cohorte'); //pagina inicial de desercion cohorte
var consultationcohorte = require('./routes/consultacohorte'); //consulta datos iniciales de desercion por cohorte
var filtercohorte = require('./routes/consultafiltroscohorte'); //consulta de filtros para cohorte
var uploadfilecohorte = require('./routes/uploadfilecohorte') //maneja datos de carga de archivo periodo

//datos de stephen
//para controlar todo lo del KPI acreditación alta calidad
var acreditacion = require('./routes/acreditacion'); //pagina inicial de acreditación alta calidad
var consultationaccreditation = require('./routes/consultaAcreditacion'); //consulta datos necesarios en public de
                                                                          //acreditación de programas
var filtredconsultationaccreditation = require('./routes/consultaFiltradaAcreditacion'); //consulta de filtros para acreditación alta calidad
var insertionaccreditation = require('./routes/actualizaAltaCalidad'); //inserta nuevo programa acreditado
var deactivateaccreditation = require('./routes/desactivaAltaCalidad'); //desactiva programa acreditado en caso de perdida de vigencia (update)
var updatekpiaccreditation = require('./routes/actualizaKPIAcreditacion'); //actualiza kpi general de acreditación
var updatewarninghighquality = require('./routes/actualizaAvisoAltaCalidad'); //actualiza kpi general de acreditación

//para controlar todo lo del KPI estudiantes por docentes tiempo completo
var filtredconsultationaccreditationstudentsperteacher = require('./routes/consultaFiltradaEstudiantesDocentes'); //consulta de filtros para estudiantes por docente tiempo completo
var studentsPerTeacher = require('./routes/estudiantesDocente'); //pagina inicial de estudiantes por docente TC
var consultationstudentsperteacher = require('./routes/consultaDocentesTC');//consulta datos necesarios en a tablas en public de
                                                                          //estudiantes por docente
var insertionstudentsperteacher = require('./routes/actualizaDocentesTC'); //actualiza poblacion de docentes o estudiantes en public
var updatekpistudentsperteacher = require('./routes/actualizaKPIDocentesTC'); //actualiza kpi general de estudiantes por docente TC
var uploadfilestudiante = require('./routes/uploadfilestudiantes');

//para controlar todo lo del KPI del nivel de formacion docentes y vista de formacion docentes por departamento
var formacion = require('./routes/formacion');
var filterFormacionDocente = require('./routes/consultaFormacion');
var consulta_update = require('./routes/consultas_update_formacion');
var formacion_departamento = require('./routes/formacion_departamento');
var uploadfileformacio = require('./routes/uploadfileformacion');

//para controlar todo lo del KPI de relacion docentes tiempo completo respecto a hora catedra
var relacionTCHC = require('./routes/relacion_docentes');
var filterTCHC = require('./routes/consultaTCHC');
var consulta_update_relacionTCHC = require('./routes/consulta_update_relacionTCHC');

//controla la consulta a del Historico
var historico = require('./routes/historico.js');

//comtrola informacion manuales_indicadores
var manual = require('./routes/manuales.js');

//controla en envio de correo de alertas de acreditados
var mail = require('./routes/alertaCorreo.js');

//controla vista planes mejoramiento
var planes = require('./routes/planesmejoramiento.js');
var consultaplanes = require('./routes/consultaplanes.js');
var actualizaplanes = require('./routes/actualizaplanes.js');
var alertaplanes = require('./routes/alertaPlanes.js');

//aqui se crea el framework de express
var app = express();

// let cache = apicache.middleware;
// view engine setup
//las pagina son tipo jade o pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cache('1 minutes'));
app.use(cookieParser());
//habilita la compresion gzip
app.use(compression());
//minifica js y css
app.use(minify());
//app.use(minify({cache: path.join(__dirname, 'public', 'cache')}));

app.use(minifyHTML({
    override:      true,
    exception_url: false,
    htmlMinifier: {
        removeComments:            true,
        collapseWhitespace:        true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes:     true,
        removeEmptyAttributes:     true,
        minifyJS:                  true
    }
}));
app.use(expiry(app, { dir: path.join(__dirname, 'public') }));

app.use(express.static(path.join(__dirname, 'public')));

//aqui se inicia la sesion para el server 86400000
app.use(session({secret: '123456', resave: true, saveUninitialized: true}));

//file upload

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
}));

//aqui se asocia cada enlace llamado con su respectiva JS en el server que lo controla
app.use('/', indicater);
app.use('/consultaUsuario', users); //consults usuario en DB
app.use('/validarestart',validar); //validar usuario recuperar contraseña
app.use('/recover',recover);
app.use('/logout',logout);//llamado a cerrar sesion y destruir variables de entorno
app.use('/tutorial',tutorial);//llamado a la pagina de guias


app.use('/satisfaccion',satisfaction); //todo la vsualizacion de el kpi de satisfaccion
app.use('/consultaFiltros',filter); //consulta filtros de satisfacccion
app.use('/consulta',consultation); //por get hace el primer llenado de datos y
                                   //por post lo filtra todo desde db

app.use('/periodo',period); //todo la vsualizacion de el kpi de Desercion periodo
app.use('/consultaperiodo',consultationperiod ); //por get hace el primer llenado de datos y
app.use('/filtrosperiodo',filterperiod);  //por post lo filtra todo desde db

app.use('/cohorte',cohorte); //todo la vsualizacion de el kpi de Desercion cohorte
app.use('/filtroscohorte',filtercohorte); //consulta filtros desercion cohorte
app.use('/consultacohorte',consultationcohorte );//por get hace el primer llenado de datos y
                                                //por post lo filtra todo desde db

//datos stephen para cada ves que se llaman una url asigne el archivo router adecuado
app.use('/acreditacion',acreditacion);
app.use('/estudiantesDocente',studentsPerTeacher);
app.use('/consultaAcreditacion',consultationaccreditation );
app.use('/consultaDocentesTC',consultationstudentsperteacher );
app.use('/consultaFiltradaAcreditacion',filtredconsultationaccreditation); //por get hace el primer llenado de datos y
                                  //por post lo filtra todo desde db
app.use('/consultaFiltradaEstudiantesDocentes',filtredconsultationaccreditationstudentsperteacher); //por get hace el primer llenado de datos y
                                  //por post lo filtra todo desde db
app.use('/desactivaAltaCalidad',deactivateaccreditation);
app.use('/actualizaAltaCalidad',insertionaccreditation);
app.use('/actualizaKPIAcreditacion',updatekpiaccreditation);
app.use('/actualizaDocentesTC',insertionstudentsperteacher);
app.use('/actualizaKPIDocentesTC',updatekpistudentsperteacher);
app.use('/actualizaAvisoAltaCalidad',updatewarninghighquality);
app.use('/uploadfilestudiantes',uploadfilestudiante);

//datos oscar
app.use('/formacion',formacion); //visualizacion del KPI nivel de formacion
app.use('/relacion_docentes',relacionTCHC);// visualizacion del KPI relacion docentes
app.use('/consultaTCHC',filterTCHC);// consulta de filtro del KPI relacion docentes
app.use('/consultaFormacion',filterFormacionDocente);// consulta filtros del KPI nivel de formacion docentes

app.use('/consultas_update_formacion',consulta_update);// consultas de actualizacion del KPI nivel de formacion docentes
app.use('/consulta_update_relacionTCHC',consulta_update_relacionTCHC); // consultas de actualizacion del KPI relacion docentes
app.use('/formacion_departamento',formacion_departamento);
app.use('/uploadfileformacion',uploadfileformacio);

//upload
app.use('/uploadfilesatisfaccion',uploadfilesatisfaccion);
app.use('/uploadfilecohorte',uploadfilecohorte);
app.use('/uploadfileperiodo',uploadfileperiod);

//historico
app.use('/historico',historico);

//manuales
app.use('/manuales',manual);

//alerta Correo
app.use('/alertaCorreo',mail);

//planes mejoramiento
app.use('/planesmejoramiento',planes);
app.use('/consultaplanes',consultaplanes);
app.use('/actualizaplanes',actualizaplanes);
app.use('/alertaPlanes',alertaplanes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
