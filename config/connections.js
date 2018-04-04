module.exports={
    dbo:{
        user:process.env.HR_USER|| 'dbo',
        password: process.env.HR_PASSWORD || '123456',
        connectString: process.env.HR_CONNECTIONSTRING || '10.0.0.124:1521/orcl'
    }
};