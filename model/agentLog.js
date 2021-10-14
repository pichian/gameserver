module.exports = (sequelize, Sequelize) => {
    return sequelize.define("agentLog", {
        id: {
            field: 'id',
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        userId: {
            type: Sequelize.STRING,
            field: 'user_id'
        },
        logType: {
            type: Sequelize.STRING,
            field: 'log_type'
        },
        logRef: {
            type: Sequelize.STRING,
            field: 'log_reference'
        },
        description: {
            type: Sequelize.STRING,
            field: 'description'
        },
        createBy: {
            type: Sequelize.STRING,
            field: 'create_by',
            allowNull: true,
            defaultValue: null
        },
        createDateTime: {
            field: 'create_datetime',
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false,
        },
    },
        {
            tableName: 'tbl_agent_logs',
            timestamps: false,
        }
    );
};


