const database = require('./services/database.js');
const webServer = require('./services/web-server.js');

process.env.UV_THREADPOOL_SIZE = 20;
async function startup() {
    console.log('Starting application');
    try {
        console.log('Opening to connections to database');

        await database.openConnections();

        console.log('Starting web server');

        await webServer.start();
    } catch (err) {
        console.log('Encountered error', err);

        process.exit(1);
    }
}

startup();