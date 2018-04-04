const oracledb = require('oracledb');
const database = require('../services/database.js');
const connectionName = 'dbo';

const insertSql = 
    `insert into jsao_users
    (
        email,
        password,
        role
    )
    values
    (
        :email,
        :hashedPassword,
        'BASE'
    )
    returning
        id,
        email,
        role
    into
        :rid,
        :remail,
        :rrole`;

async function create(user) {
    user.email = user.email.toLowerCase();
    user.rid = {
        type: oracledb.NUMBER,
        dir: oracledb.BIND_OUT
    }
    user.remail = {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT
    }
    user.rrole = {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT
    }

    const results = await database.simpleExecutePost(
        connectionName, 
        insertSql, 
        user, 
        {autoCommit : true});

    return results.outBinds;
}

module.exports.create = create;