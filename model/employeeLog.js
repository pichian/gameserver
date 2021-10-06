module.exports = (sequelize, Sequelize) => {
    return sequelize.define("employeeLog", {
        id: {
            field: 'id',
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        playerId: {
            type: Sequelize.INTEGER,
            field: 'player_id'
        },
        logType: {
            type: Sequelize.STRING,
            field: 'log_type'
        },
        logReference: {
            type: Sequelize.STRING,
            field: 'log_reference'
        },
        description: {
            type: Sequelize.STRING,
            field: 'description'
        },
        createBy: {
            type: Sequelize.INTEGER,
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
            tableName: 'tbl_employee_logs',
            timestamps: false,

        }
    );
};


