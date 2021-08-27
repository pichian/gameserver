module.exports = (sequelize, Sequelize) => {
    const OwnerModel = sequelize.define("OwnerModel", {
        id: {
            field: 'Owner_ID',
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: Sequelize.STRING,
            field: 'Owner_UserName'
        },
        firstname: {
            type: Sequelize.STRING,
            field: 'Owner_FirstName'
        },
        lastname: {
            type: Sequelize.STRING,
            field: 'Owner_LastName'
        },
        email: {
            type: Sequelize.STRING,
            field: 'Owner_Email'
        },
        password: {
            type: Sequelize.STRING,
            field: 'Owner_Password'
        },
        phone: {
            type: Sequelize.STRING,
            field: 'Owner_Phone'
        },
        userStatus: {
            type: Sequelize.BOOLEAN,
            field: 'Owner_UserStatus'
        },
        refCodeAgent: {
            type: Sequelize.STRING,
            field: 'Owner_RefCodeAgent'
        },

    },
        {
            tableName: 'Owner',
            timestamps: false,

        }
    );

    return OwnerModel;
};


