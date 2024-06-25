import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

import { QueryTypes, Sequelize } from 'sequelize';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || '';
    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        (req as any).user = user;
        next();
    });
}

function generateAccessToken(user: any) {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || '';
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
}

function generateRefreshToken(user: any) {
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || '';
    return jwt.sign(user, REFRESH_TOKEN_SECRET);
}

authentication();

import getTaskMapper from './dbmapper/task.mapper';
import getUserMapper from './dbmapper/user.mapper';
import getTokenMapper from './dbmapper/token.mapper';
const Tasks = getTaskMapper(sequelize);
const Users = getUserMapper(sequelize);
const Token = getTokenMapper(sequelize);

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    // authentication();
    res.send(`Express + Typescript is working\n${authenticationMsg}`);
});

app.post('/tasks/add', authenticateToken, async (req: Request, res: Response) => {
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

app.put('/tasks/update', authenticateToken, async (req: Request, res: Response) => {
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

app.delete('/tasks/remove', authenticateToken, async (req: Request, res: Response) => {
    try {
        const result = await Tasks.destroy({
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

app.get('/tasks', authenticateToken, async (req: Request, res: Response) => {
    try {
        const result = await Tasks.findAll({
            attributes: ['title', 'description', 'status', 'taskId']
        });

        res.send({ response: { tasks: result }, errorCode: 0, errorMessage: 'Successfully fetched' }).status(200);
    } catch (exception) {
        res.send({ response: { exception }, errorCode: 9, errorMessage: 'Error Occurred' }).status(200);
    }
});

// Login, Users
app.get('/users', authenticateToken, async (req: Request, res: Response) => {
    try {
        const result = await Users.findAll({
            attributes: ['user', 'password', 'userId']
        });
        res.send({ response: { users: result }, errorCode: 0, errorMessage: 'Successfully fetched' }).status(200);
    } catch (exception) {
        res.send({ response: { exception }, errorCode: 9, errorMessage: 'Error Occurred' }).status(200);
    }
});

app.post('/users/create', async (req: Request, res: Response) => {
    try {
        const user = { ...req.body };
        const count = await Users.count({ where: { user: user.user } });
        if (count > 0) {
            res.status(403).send({ response: { create: 'FAILED' }, errorCode: 1, errorMessage: 'User already exists' });
            return;
        }
        user.password = await bcrypt.hash(user.password, 10);

        const result = await Users.create(user, {
            fields: ['user', 'password']
        });
        res.send({ response: { create: 'SUCCESS' }, errorCode: 0, errorMessage: 'Successfully created' }).status(201);
    } catch (exception) {
        res.send({ response: { exception }, errorCode: 9, errorMessage: 'Error Occurred' }).status(500);
    }
});

app.post('/users/login', async (req: Request, res: Response) => {
    const user = { ...req.body };
    const result = await Users.findOne({ where: { user: user.user } });
    if (!result?.dataValues) {
        res.status(400).send({ response: { login: 'FAILED' }, errorCode: 1, errorMessage: 'Cannot find the user' });
        return;
    }
    const userData = result.dataValues;
    try {
        if (await bcrypt.compare(user.password, userData.password)) {
            const accessToken = generateAccessToken({ user: user.user });
            const refreshToken = generateRefreshToken({ user: user.user });
            const token = { refreshToken, user: user.user };
            const tokenResult = await Token.create(token, {
                fields: ['user', 'refreshToken']
            });

            res.status(200).send({ response: { login: 'SUCCESS', accessToken, refreshToken }, errorCode: 0, errorMessage: 'User logged in successfully' });
        } else {
            res.status(200).send({ response: { login: 'FAILED' }, errorCode: 1, errorMessage: 'Invalid credentials' });
        }
    } catch(exception) {
        console.log(exception);
        res.status(500).send();
    }
});

app.post('/token', async (req: Request, res: Response) => {
    const refreshToken = req.body.token;
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    const refreshTokenFromDb = await Token.findOne({
        where: { refreshToken }
    });
    if (!refreshTokenFromDb?.dataValues) {
        return res.sendStatus(403);
    } 
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || '';
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any, user: any) => {
        if (err) {
            return res.sendStatus(403);
        }
      const accessToken = generateAccessToken({ name: user.name });
      res.json({ accessToken: accessToken });
    });
  });
  
app.delete('/logout', async (req: Request, res: Response) => {
    const result = await Token.destroy({
        where: {
            user: req.body.user
        }
    });
    if (result > 0) {
        res.send({ response: { logout: 'SUCCESS' }, errorCode: 0, errorMessage: 'Logout Success' }).status(204);
    } else {
        res.send({ response: { logout: 'FAILURE' }, errorCode: 1, errorMessage: 'Failed to remove' }).status(500);
    }
});


app.listen(port, '0.0.0.0', () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

