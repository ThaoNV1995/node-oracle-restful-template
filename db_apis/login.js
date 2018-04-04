const oracledb = require('oracledb');
const database = require('../services/database.js');
const connectionName = 'dbo';

const loginSql = 
    `select id as "id", 
        email as "email", 
        password as "password", 
        role as "role"
        from jsao_users 
        where email = :email`;

async function login(user) {
    const results = await database.simpleExecute(
        connectionName, 
        loginSql, 
        user, 
        {resultSet: true, outFormat: oracledb.OBJECT});

    return results.rows;
}

module.exports.login = login;