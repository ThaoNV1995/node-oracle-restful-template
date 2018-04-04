const oracledb = require('oracledb');
const connections = require('../config/connections.js');
const connectionKeys = Object.keys(connections);

async function openConnections() {
    for(let x=0; x< connectionKeys.length; x+=1){
        const connInfo = connections[connectionKeys[x]];

        const  pool = await oracledb.createPool({
            user: connInfo.user,
            password: connInfo.password,
            connectString: connInfo.connectString,
            poolAlias: connectionKeys[x],
            poolMin: connInfo.poolMin,
            poolMax: connInfo.poolMax,
            poolIncrement: connInfo.poolIncrement,
            _enableStats: connInfo._enableStats
        });

        const conn = await pool.getConnection();

        await conn.release();
    }
}

module.exports.openConnections = openConnections;

async function simpleExecute(connectionName, sql ,binds, options){

    return new Promise(async (resolve, reject)=>{
        let conn;
        if (options.resultSet !== true) {
            reject(new Error('This API is for Result Sets only'));
            return;
        }
      
        try {
         
            conn = await oracledb.getConnection(
                connectionName
            );
          
             const result = await conn.execute(sql, binds, options);
            const retval = [];
            let row = await result.resultSet.getRow();
            while (row) {

              retval.push(row);
      
              row = await result.resultSet.getRow();
            }
            var dataResult = {
                outBinds: result.outBinds,
                rowsAffected: result.rowsAffected,
                metaData: result.metaData,
                rows: retval
            }
            resolve(dataResult);
           
          } catch (err) {
            console.log('Error occurred', err);
      
            reject(err);
          } finally {
            if (conn) {
              try {
                await conn.close();
              } catch (err) {
                console.log('Error closing connection', err);
              }
            }
          }
    });
}

module.exports.simpleExecute = simpleExecute;

async function simpleExecutePost(connectionName, sql ,binds, options){
    return new Promise(async (resolve, reject)=>{
        let conn;

        try {
            conn = await oracledb.getConnection(
                connectionName
            );
            const result = await conn.execute(sql, binds, options);
            
            resolve(result);
          } catch (err) {
            console.log('Error occurred', err);
      
            reject(err);
          } finally {
            if (conn) {
              try {
                await conn.close();
              } catch (err) {
                console.log('Error closing connection', err);
              }
            }
          }
    })
}

module.exports.simpleExecutePost = simpleExecutePost;