module.exports = (sequelize, Sequelize) => {
    const PlayerModel = sequelize.define("PlayerModel", {
        id: {
            field: 'Player_ID',
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: Sequelize.STRING,
            field: 'Player_UserName'
        },
        firstname: {
            type: Sequelize.STRING,
            field: 'Player_FirstName'
        },
        lastname: {
            type: Sequelize.STRING,
            field: 'Player_LastName'
        },
        email: {
            type: Sequelize.STRING,
            field: 'Player_Email'
        },
        password: {
            type: Sequelize.STRING,
            field: 'Player_Password'
        },
        phone: {
            type: Sequelize.STRING,
            field: 'Player_Phone'
        },
        userStatus: {
            type: Sequelize.BOOLEAN,
            field: 'Player_UserStatus'
        },
        refCodeAgent: {
            type: Sequelize.STRING,
            field: 'Player_RefCodeAgent'
        },

    },
        {
            tableName: 'player',
            timestamps: false,

        }
    );

    return PlayerModel;
};


