import { DataTypes, Sequelize } from 'sequelize';

function getTaskMapper(sequelize: Sequelize) {
    return sequelize.define('task', {
        title: {
            field: 'tm_title',
            type: DataTypes.STRING
        },
        description: {
            field: 'tm_description',
            type: DataTypes.STRING
        },
        status: {
            field: 'tm_status',
            type: DataTypes.STRING
        },
        taskId: {
            field: 'tm_task_id',
            type: DataTypes.BIGINT,
            primaryKey: true
        }
    }, { tableName: 'task_table' });
}

export = getTaskMapper;
