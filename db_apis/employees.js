const oracledb = require('oracledb');
const database = require('../services/database.js');
const security = require('../services/security.js');
const connectionName = 'dbo';

const baseQuery = 
    `select employee_id "id",
        first_name "fist_name",
        last_name "last_name",
        email "email",
        phone_number "phone_number",
        hire_date "hire_date",
        job_id "job_id",
        salary "salary",
        commission_pct "commission_pct",
        manager_id "manager_id",
        department_id "department_id"
    from employees`;

const paginator = '\n' +
    `offset :offset rows
     fetch next :fetch rows only`;

async function find(context) {
    let query;
    const binds = {};
    const orderParts = (context.order || 'employee_id:asc').split(':');
    let orderCol = 'id';//security.assertSimpleSqlName(orderParts[0]);
    const orderDir = 'asc';//security.assertValidSortOrder(orderParts[1]);
    if(orderCol === 'id'){
        orderCol = 'employee_id';
    }
    binds.offset = context.offset || 0;
    binds.fetch = context.limit || 100;

    if(context.id){
        binds.employee_id = context.id;

        query = baseQuery +
            `\n where employee_id = :employee_id` +
            `\n order by ${orderCol} ${orderDir}` +
            paginator;
    } else{
        query = baseQuery +
            `\n order by ${orderCol} ${orderDir}` +
            paginator;
    }

    const results  = await database.simpleExecute(connectionName, query, binds, {resultSet: true, outFormat: oracledb.OBJECT});
    return results.rows ;
}
module.exports.find = find;

const createSql = 
    `insert into employees (
        first_name,
        last_name,
        email,
        phone_number,
        hire_date,
        job_id,
        salary,
        commission_pct,
        manager_id,
        department_id
    ) values(
        :first_name,
        :last_name,
        :email,
        :phone_number,
        :hire_date,
        :job_id,
        :salary,
        :commission_pct,
        :manager_id,
        :department_id
    ) return employee_id into :employee_id`;

async function create(employee){
    employee.employee_id={
        dir:oracledb.BIND_OUT,
        type: oracledb.NUMBER
    };
 
    const result = await database.simpleExecutePost(
        connectionName, 
        createSql, 
        employee, 
        {autoCommit : true});


    employee.employee_id = result.outBinds.employee_id[0];

    return employee;
}

module.exports.create = create;

const updateSql = 
    `update employees
    set first_name = :first_name,
        last_name = :last_name,
        email = :email,
        phone_number = :phone_number,
        hire_date = :hire_date,
        job_id = :job_id,
        salary = :salary,
        commission_pct = :commission_pct,
        manager_id = :manager_id,
        department_id = :department_id
    where employee_id= :employee_id`;

    async function update(employee){
        const result = await database.simpleExecutePost(
            connectionName, 
            updateSql, 
            employee, 
            {autoCommit : true});
    
        return employee;
    }

module.exports.update = update;

const delSql = 
    `DELETE FROM employees WHERE  employee_id= :employee_id`;

async function del(employee_id){
    const result = await database.simpleExecutePost(
        connectionName, 
        delSql, 
        employee_id, 
        {autoCommit : true});

    return employee_id;
}

module.exports.delete = del;