module.exports = (sequelize, Sequelize) => {
    const agentPaymentRequestModel = sequelize.define("agentPaymentRequest", {
        id: {
            field: 'id',
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        agentId: {
            type: Sequelize.INTEGER,
            field: 'agent_id'
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
            type: Sequelize.INTEGER,
            field: 'approved_by',
            defaultValue: null
        },
        approveDateTime: {
            field: 'approved_datetime',
            type: Sequelize.DATE,
        },
        createBy: {
            type: Sequelize.INTEGER,
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
            type: Sequelize.INTEGER,
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
    return agentPaymentRequestModel;
};


