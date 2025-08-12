export default {
  routes: [
    {
      method: "GET",
      path: "/appartments/available",
      handler: "api::appartment.appartment.findAvailable",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/appartments/rented",
      handler: "api::appartment.appartment.findRented",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
