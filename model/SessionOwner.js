module.exports = (sequelize, Sequelize) => {
    const sessionOwner = sequelize.define("sessionOwner", {
        id: {
            field: 'id',
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        ownerId: {
            type: Sequelize.INTEGER,
            field: 'owner_id'
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

    return sessionOwner;
};


