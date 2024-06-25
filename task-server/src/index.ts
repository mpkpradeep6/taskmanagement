import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import { QueryTypes, Sequelize } from 'sequelize';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

const envPath = path.resolve(__dirname, '../../.env');
// const envPath = path.resolve(__dirname, '../.sample.env');
dotenv.config({ path: envPath });

import { config } from './config/db.config';

const app: Express = express();
const port = (process.env.NODE_LOCAL_PORT || 6868) as any;

const dbConfig = config as any;
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    // operatorsAliases: false,
    define: {
        timestamps: false
    },
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

let authenticationMsg = 'Not Authenticated';
let isAuthenticationCalled = false;
async function authentication() {
    if (isAuthenticationCalled) {
        return;
    }
    sequelize.authenticate()
        .then(onfulfilled => {
            console.log('Authentication Success');
            authenticationMsg = 'Authentication Success';
            isAuthenticationCalled = true;
        }, onrejected => {
            console.log('Authentication Error');
            authenticationMsg = 'Authentication Error';
            isAuthenticationCalled = true;
        });
}

authentication();

import getTaskMapper from './dbmapper/task.mapper';
const Tasks = getTaskMapper(sequelize);

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    // authentication();
    res.send(`Express + Typescript is working\n${authenticationMsg}`);
});

app.post('/tasks/add', async (req: Request, res: Response) => {
    try {
        const task = { ...req.body };
        const result = await Tasks.create(task, {
            fields: ['title', 'description', 'status']
        });
        res.send({ response: { add: 'SUCCESS' }, errorCode: 0, errorMessage: 'Successfully added' }).status(200);
    } catch (exception) {
        res.send({ response: { exception }, errorCode: 9, errorMessage: 'Error Occurred' }).status(500);
    }
});

app.put('/tasks/update', async (req: Request, res: Response) => {
    try {
        const task = { ...req.body };
        const result = await Tasks.update(task, {
            fields: ['title', 'description', 'status'],
            where: {
                taskId: task.taskId
            }
        });
        if (result.length > 0 && result[0] > 0) {
            res.send({ response: { update: 'SUCCESS' }, errorCode: 0, errorMessage: 'Successfully updated' }).status(200);
        } else {
            res.send({ response: { update: 'ROWS NOT FOUND' }, errorCode: 1, errorMessage: 'Failed to update' }).status(200);
        }
    } catch (exception) {
        res.send({ response: { exception }, errorCode: 9, errorMessage: 'Error Occurred' }).status(500);
    }
});

app.delete('/tasks/remove', async (req: Request, res: Response) => {
    try {
        const result = await Tasks.destroy({
            // fields: ['title', 'description', 'status']
            where: {
                taskId: req.body.taskId
            }
        });
        if (result === 1) {
            res.send({ response: { remove: 'SUCCESS' }, errorCode: 0, errorMessage: 'Successfully removed' }).status(200);
        } else {
            res.send({ response: { remove: 'ROWS NOT FOUND' }, errorCode: 1, errorMessage: 'Failed to remove' }).status(200);
        }
    } catch (exception) {
        res.send({ exception }).status(500);
    }
});

app.get('/tasks', async (req: Request, res: Response) => {
    try {
        const result = await Tasks.findAll({
            attributes: ['title', 'description', 'status', 'taskId']
        });

        res.send({ response: { tasks: result }, errorCode: 0, errorMessage: 'Successfully fetched' }).status(200);
    } catch (exception) {
        res.send({ response: { exception }, errorCode: 9, errorMessage: 'Error Occurred' }).status(200);
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

