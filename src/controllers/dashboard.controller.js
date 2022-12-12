const Order = require("../models/order.model");
const User = require("../models/user.model");

module.exports.getDashboard = async (req, res, next) => {
  try {
    // get new orders
    const newOrders = await Order.find({ status: "pending" });

    // get client counts
    const clientsCount = await User.find({
      role: "client",
    }).countDocuments();

    // get earning of month
    const paidOrders = await Order.find(
      {
        status: "paid",
        $sort: {
          createdAt: 1,
        },
      },
      "price createdAt"
    );
    const totalEarn = paidOrders.reduce((prev, cur) => prev + cur, 0);

    let earnOfMonth = 0;
    let months = 0;
    if (paidOrders.length > 0) {
      months = Math.round(
        (new Date(paidOrders[0].createdAt).getTime() -
          new Date(paidOrders.at(-1).createdAt).getTime()) /
          (1000 * 60 * 60 * 24 * 30)
      );
      earnOfMonth = months > 0 ? totalEarn / months : totalEarn;
    }

    return res.status(200).json({
      newOrders,
      clientsCount,
      totalEarn,
      months,
      earnOfMonth,
    });
  } catch (error) {
    next(error);
  }
};
