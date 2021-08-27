module.exports = (sequelize, Sequelize) => {
    const SessionOwnerModel = sequelize.define("SessionOwnerModel", {
        id: {
            field: 'SessionOwner_ID',
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        OwnerId: {
            type: Sequelize.INTEGER,
            field: 'Owner_ID'
        },
        token: {
            type: Sequelize.STRING,
            field: 'SessionOwner_Token'
        },

    },
        {
            tableName: 'session_Owner',
            timestamps: false,

        }
    );

    return SessionOwnerModel;
};


