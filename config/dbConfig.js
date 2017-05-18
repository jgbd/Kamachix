var pg = require("pg");

//funcion que contiene la configuracion de la conexion a la base de datos
function configdb(){
  var config = {
    user: 'postgres', //env var: PGUSER
    database: 'datos_indicadores', //env var: PGDATABASE
    //password: 'kamachix', //env var: PGPASSWORD
    password: '123',
    host: 'localhost', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  };

  //variable que controla el pool de conexiones
  var pool = new pg.Pool(config);

  pool.setMaxListeners(0)

  return pool;
}

module.exports.configdb = configdb;
