module.exports = (sequelize, Sequelize) => {
    return sequelize.define("sessionOwner", {
        ownerCode: {
            type: Sequelize.STRING,
            field: 'owner_code',
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
        }
    },
        {
            tableName: 'session_owner',
            timestamps: false,

        }
    );
};


