const employees = require('../db_apis/employees.js');
function get(req, res, next){
    console.log('get employee');
    const context = {
        id: parseInt(req.params.id),
        offset: parseInt(req.query.offset),
        limit:parseInt(req.query.limit),
        order: req.query.order
    };

    employees.find(context)
        .then(rows=>{
            if(req.params.id){
                if(rows.length === 1){
                    res.status(200).json(rows[0]);
                } else{
                    res.status(404).end();
                }
            } else{
                res.status(200).json(rows);
            }
        })
        .catch(next);
}

module.exports.get = get;

function post(req, res, next){
    const employee ={
        employee_id: req.body.employee_id,
        first_name: req.body.first_name.toLowerCase(),
        last_name: req.body.last_name.toLowerCase(),
        email: req.body.email.toLowerCase(),
        phone_number: req.body.phone_number.toLowerCase(),
        hire_date: req.body.hire_date,
        job_id: req.body.job_id,
        salary: req.body.salary,
        commission_pct: req.body.commission_pct.toLowerCase(),
        manager_id: req.body.manager_id,
        department_id: req.body.department_id
    }

    employees.create(employee)
        .then(employee=> res.status(201).json(employee))
        .catch(next);
}

module.exports.post = post;

function put(req, res, next){
    const employee ={
        employee_id: req.body.employee_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        hire_date: req.body.hire_date,
        job_id: req.body.job_id,
        salary: req.body.salary,
        commission_pct: req.body.commission_pct,
        manager_id: req.body.manager_id,
        department_id: req.body.department_id
    }

    employees.update(employee)
        .then(employee=> res.status(200).json(employee))
        .catch(next);
}

module.exports.put = put;

function del(req, res, next){
    const employee_id = {employee_id : req.body.employee_id};

    employees.delete(employee_id)
    .then(employee=> res.status(200).json(employee))
    .catch(next);
}

module.exports.delete = del;
