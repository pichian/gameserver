module.exports = (sequelize, Sequelize) => {
    return sequelize.define("employeeLog", {
        id: {
            field: 'id',
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        playerCode: {
            type: Sequelize.STRING,
            field: 'player_code'
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
            tableName: 'tbl_employee_logs',
            timestamps: false,

        }
    );
};


