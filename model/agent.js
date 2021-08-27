module.exports = (sequelize, Sequelize) => {
    const AgentModel = sequelize.define("AgentModel", {
        id: {
            field: 'Agent_ID',
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: Sequelize.STRING,
            field: 'Agent_UserName'
        },
        firstname: {
            type: Sequelize.STRING,
            field: 'Agent_FirstName'
        },
        lastname: {
            type: Sequelize.STRING,
            field: 'Agent_LastName'
        },
        email: {
            type: Sequelize.STRING,
            field: 'Agent_Email'
        },
        password: {
            type: Sequelize.STRING,
            field: 'Agent_Password'
        },
        phone: {
            type: Sequelize.STRING,
            field: 'Agent_Phone'
        },
        userStatus: {
            type: Sequelize.BOOLEAN,
            field: 'Agent_UserStatus'
        },
        refCodeAgent: {
            type: Sequelize.STRING,
            field: 'Agent_RefCodeAgent'
        },

    },
        {
            tableName: 'Agent',
            timestamps: false,

        }
    );

    return AgentModel;


    
};


