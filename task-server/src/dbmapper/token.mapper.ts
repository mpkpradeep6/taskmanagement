import { DataTypes, Sequelize } from 'sequelize';

function getTokenMapper(sequelize: Sequelize) {
    return sequelize.define('token', {
        user: {
            field: 'tm_user',
            type: DataTypes.STRING
        },
        refreshToken: {
            field: 'tm_refresh_token',
            type: DataTypes.STRING,
            primaryKey: true
        }
    }, { tableName: 'token_table' });
}

export = getTokenMapper;
