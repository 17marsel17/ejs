
import * as fs from 'fs'
import * as os from 'os'

export const logger = (req, res, next) => {
    const now = Date.now();
    const {url, method} = req;

    const data = `${now} ${method} ${url}`;

    fs.appendFile('server.log', data + os.EOL, (err) => {
        if (err) throw err;
    });

    next();
}