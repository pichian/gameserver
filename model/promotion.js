module.exports = (sequelize, Sequelize) => {
    return sequelize.define("PromotionModel", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        promotionName: {
            type: Sequelize.STRING,
            field: 'promotion_name'
        },
        promotionType: {
            type: Sequelize.INTEGER,
            field: 'promotion_type'
        },
        rateType: {
            type: Sequelize.INTEGER,
            field: 'rate_type'
        },
        rateAmount: {
            type: Sequelize.FLOAT,
            field: 'rate_amount'
        },
        dateStart: {
            field: 'date_start',
            type: Sequelize.DATE,
            allowNull: false,
        },
        dateStop: {
            field: 'date_stop',
            type: Sequelize.DATE,
            allowNull: false,
        },
        status: {
            type: Sequelize.INTEGER,
            field: 'status'
        },
        description: {
            type: Sequelize.STRING,
            field: 'description'
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
            tableName: 'promotion',
            timestamps: false,
        }
    );
};
