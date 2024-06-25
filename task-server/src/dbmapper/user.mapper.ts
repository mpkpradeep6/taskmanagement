import { DataTypes, Sequelize } from 'sequelize';

function getUserMapper(sequelize: Sequelize) {
    return sequelize.define('user', {
        user: {
            field: 'tm_user',
            type: DataTypes.STRING
        },
        password: {
            field: 'tm_password',
            type: DataTypes.STRING
        },
        userId: {
            field: 'tm_user_id',
            type: DataTypes.BIGINT,
            primaryKey: true
        }
    }, { tableName: 'user_table' });
}

export = getUserMapper;
