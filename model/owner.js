module.exports = (sequelize, Sequelize) => {
    const owner = sequelize.define("owner", {
        id: {
            field: 'id',
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userRefCode: {
            type: Sequelize.STRING,
            field: 'user_ref_code'
        },
        roleType: {
            type: Sequelize.STRING,
            field: 'rtype'
        },
        displayName: {
            type: Sequelize.STRING,
            field: 'display_name'
        },
        firstname: {
            type: Sequelize.STRING,
            field: 'firstname'
        },
        lastname: {
            type: Sequelize.STRING,
            field: 'lastname'
        },
        username: {
            type: Sequelize.STRING,
            field: 'username'
        },
        password: {
            type: Sequelize.STRING,
            field: 'password'
        },
        email: {
            type: Sequelize.STRING,
            field: 'email'
        },
        phoneNumber: {
            type: Sequelize.STRING,
            field: 'phone'
        },
        description: {
            type: Sequelize.STRING,
            field: 'description'
        },
        status: {
            type: Sequelize.STRING,
            field: 'status'
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
        updateBy: {
            type: Sequelize.INTEGER,
            field: 'update_by',
            allowNull: true,
            defaultValue: null
        },
        updateDateTime: {
            field: 'update_datetime',
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        }
    },
        {
            tableName: 'tbm_owner_info',
            timestamps: false,

        }
    );

    return owner;
};


