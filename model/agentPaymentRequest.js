module.exports = (sequelize, Sequelize) => {
    return sequelize.define("agentPaymentRequest", {
        id: {
            field: 'id',
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        agentRefCode: {
            type: Sequelize.STRING,
            field: 'agent_ref_code'
        },
        paymentType: {
            type: Sequelize.STRING,
            field: 'payment_type'
        },
        wayToPay: {
            type: Sequelize.STRING,
            field: 'way_to_pay'
        },
        amount: {
            type: Sequelize.DOUBLE,
            field: 'payment_amount'
        },
        paymentStatus: {
            type: Sequelize.STRING,
            field: 'payment_status'
        },
        promotionRefId: {
            type: Sequelize.INTEGER,
            field: 'promotion_ref_id',
        },
        remark: {
            type: Sequelize.STRING,
            field: 'remark',
        },
        approvedBy: {
            type: Sequelize.STRING,
            field: 'approved_by',
            defaultValue: null
        },
        approveDateTime: {
            field: 'approved_datetime',
            type: Sequelize.DATE,
        },
        createRoleType: {
            type: Sequelize.STRING,
            field: 'create_rtype'
        },
        createBy: {
            type: Sequelize.STRING,
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
            type: Sequelize.STRING,
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
            tableName: 'tbt_agent_payment_request',
            timestamps: false,

        }
    );
};


