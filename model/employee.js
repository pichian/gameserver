module.exports = (sequelize, Sequelize) => {
    const EmployeeModel = sequelize.define("EmployeeModel", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.STRING,
            field: 'title'
        },
        firstname: {
            type: Sequelize.STRING,
            field: 'firstname'
        },
        lastname: {
            type: Sequelize.STRING,
            field: 'lastname'
        },
        email: {
            type: Sequelize.STRING,
            field: 'email'
        },
        phoneNumber: {
            type: Sequelize.STRING,
            field: 'phone'
        },
        username: {
            type: Sequelize.STRING,
            field: 'username'
        },
        password: {
            type: Sequelize.STRING,
            field: 'password'
        },
        description: {
            type: Sequelize.STRING,
            field: 'description'
        },
        workBeginDate: {
            type: Sequelize.DATE,
            field: 'starting_date',
        },
        status: {
            type: Sequelize.STRING,
            field: 'status'
        },
        createBy: {
            type: Sequelize.INTEGER,
            field: 'create_by'
        },
        createDateTime: {
            field: 'create_datetime',
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false,
        },
        updateBy: {
            type: Sequelize.INTEGER,
            field: 'update_by'
        },
        updateDateTime: {
            field: 'update_datetime',
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        }
    },
        {
            tableName: 'tbm_employee_info',
            timestamps: false,

        }
    );

    return EmployeeModel;
};