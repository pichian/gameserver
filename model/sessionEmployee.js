module.exports = (sequelize, Sequelize) => {
    return sequelize.define("sessionEmployee", {
        id: {
            field: 'id',
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        employeeId: {
            type: Sequelize.INTEGER,
            field: 'employee_id'
        },
        token: {
            type: Sequelize.STRING,
            field: 'token'
        },
        status: {
            type: Sequelize.STRING,
            field: 'status'
        },
        createDateTime: {
            field: 'create_datetime',
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
    },
        {
            tableName: 'session_employee',
            timestamps: false,

        }
    );
};


