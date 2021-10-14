module.exports = (sequelize, Sequelize) => {
    return sequelize.define("promotion", {
        promotionCode: {
            type: Sequelize.STRING,
            field: 'promotion_code',
            allowNull: true,
            defaultValue: null,
            primaryKey: true
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
            type: Sequelize.DOUBLE,
            field: 'rate_value'
        },
        dateStart: {
            field: 'start_datetime',
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false,
        },
        dateStop: {
            field: 'end_datetime',
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
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
        createRoleType: {
            type: Sequelize.STRING,
            field: 'create_rtype',
            defaultValue: null
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
            tableName: 'tbm_promotion',
            timestamps: false,
        }
    )
};
