import mysql from 'mysql';
import util from 'util';

import { readFileSync } from 'fs';
const config = JSON.parse(
    readFileSync(
        new URL('./config.json', import.meta.url)
    )
);

async function initdb() {
    return new Promise((resolve, reject) => {
        var connection;
        console.log("---- Connection pooling ", config.enableConnectPool?"ENABELD":"DISABLED")
        if(config.enableConnectPool) {
            connection = mysql.createPool({
                connectionLimit: config.DB.connectionLimit,
                host: config.DB.host,
                user: config.DB.username,
                password: config.DB.password,
                port: config.DB.port,
                database: config.DB.database
            });
    
            connection.getConnection((err) => {
                if (err) {
                    reject('Error occoured' + err)
                    // throw 'Error occoured' + err;
                }
                console.log("Connection Created");
                global.query = util.promisify(connection.query).bind(connection);
    
                global.connection = connection
    
                resolve("Connection Created")
            });
        } else {
            connection = mysql.createConnection({
                host: config.DB.host,
                user: config.DB.username,
                password: config.DB.password,
                port: config.DB.port,
                database: config.DB.database
            });
    
            connection.connect((err) => {
                if (err) throw err;
                global.query = util.promisify(connection.query).bind(connection);
    
                global.connection = connection
                console.log('Connected to MySQL Server!');
    
                resolve("Connection Created")
            });
        }
    })
}

export { initdb }
