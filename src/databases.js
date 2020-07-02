const mysql = require('mysql');
const {database} = require('./keys');
const {promisify} = require('util');

const conn = mysql.createPool(database);

conn.getConnection((err, connection) =>{

    if(err){

    if(err.code === 'PROTOCOL_CONNECTION_LOST' ){
        console.error('DATABASE CONNECTION WAS CLOSED');
    }
    if(err.code === 'ER_CON_COUNT_ERROR'){
        console.error('DATABASE  HAS TO WAY CONNECTIONS');
    }
    if(err.code === 'ECONNREFUSED'){
        console.error('DATABASE CONNECTION WAS REFUSED');
    }
    
    }

    if(connection) connection.release();
    console.log('DB  is connected');
    return;
});

// Promisify conn query
conn.query = promisify(conn.query);

module.exports = conn;