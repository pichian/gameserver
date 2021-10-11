module.exports = (sequelize, Sequelize) => {
    return sequelize.define("sessionEmployee", {
        employeeCode: {
            type: Sequelize.STRING,
            field: 'employee_code',
            primaryKey: true
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


