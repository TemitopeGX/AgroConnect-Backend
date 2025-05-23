module.exports = (req, res) => {
  res.json({
    status: "online",
    message: "Welcome to AgroConnect Naija API",
    version: "1.0.0",
    documentation:
      "https://github.com/TemitopeGX/AgroConnect-Backend#-api-routes",
    endpoints: {
      auth: {
        checkUser: "/api/auth/check-user",
        createUser: "/api/auth/create-user",
      },
      produce: {
        create: "/api/produce/create",
        list: "/api/produce/list",
      },
      orders: {
        place: "/api/orders/place",
        myOrders: "/api/orders/my-orders",
      },
    },
  });
};
