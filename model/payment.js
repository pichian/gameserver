module.exports = (sequelize, Sequelize) => {
    const payment = sequelize.define("payment", {
        id: {
            field: 'id',
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: Sequelize.INTEGER,
            field: 'user_id'
        },
        amount: {
            type: Sequelize.INTEGER,
            field: 'amount'
        },
        type: {
            type: Sequelize.INTEGER,
            field: 'type'
        },
        status: {
            type: Sequelize.INTEGER ,
            field: 'status'
        }

    },
        {
            tableName: 'payment',
            timestamps: false,

        }
    );

    return payment;


    
};


