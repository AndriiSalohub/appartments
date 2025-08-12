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
  ],
};
