/**
 * appartment service
 */

import { factories } from "@strapi/strapi";

interface FindParams {
  user: StrapiUser;
  query?: any;
}

interface FindOneParams {
  user: StrapiUser;
  query?: any;
}

interface FindAvailableParams {
  user: StrapiUser;
  startDate: Date;
  endDate: Date;
}

export default factories.createCoreService(
  "api::appartment.appartment",
  ({ strapi }) => ({
    async find({ user, query = {} }: FindParams) {
      try {
        const roleName = user.role?.name;

        if (!roleName) {
          throw new Error("Invalid user role");
        }

        const queryParams = {
          filters: {},
          populate: {
            owner: {
              fields: ["username", "email"],
            },
          },
        };

        if (roleName === "Admin" || roleName === "admin") {
          console.log("Admin");

          queryParams.filters = {
            owner: {
              id: user.id,
            },
          };
        } else if (
          roleName === "Authenticated" ||
          roleName === "authenticated"
        ) {
          console.log("Authenticated");
        } else {
          throw new Error("Insufficient permissions");
        }

        const { results, pagination } = await strapi.entityService.findPage(
          "api::appartment.appartment",
          {
            ...queryParams,
            ...query,
          }
        );

        return { results, pagination };
      } catch (error) {
        strapi.log.error("Service error in apartment find:", error);
        throw error;
      }
    },

    async findOne(id: string, { user, query = {} }: FindOneParams) {
      try {
        const roleName = user?.role?.name;

        if (!roleName) {
          throw new Error("Invalid user role");
        }

        let queryParams = {};

        if (roleName === "Admin" || roleName === "admin") {
          console.log("Admin");
          queryParams = {
            filters: {
              id: id,
            },
            populate: {
              owner: {
                fields: ["username"],
              },
              rent_records: {
                fields: ["start_date", "end_date"],
                populate: {
                  renter: {
                    fields: ["username"],
                  },
                },
              },
            },
          };
        } else if (
          roleName === "Authenticated" ||
          roleName === "authenticated"
        ) {
          queryParams = {
            populate: {
              owner: {
                fields: ["username"],
              },
            },
            filters: {
              id: id,
            },
          };
        } else {
          throw new Error("Insufficient permissions");
        }

        const results = await strapi.entityService.findMany(
          "api::appartment.appartment",
          {
            ...queryParams,
            ...query,
          }
        );

        return results.length > 0 ? results[0] : null;
      } catch (error) {
        strapi.log.error("Service error in apartment findOne:", error);
        throw error;
      }
    },

    async findAvailable({ user, startDate, endDate }: FindAvailableParams) {
      try {
        const roleName = user.role?.name;
        if (!roleName) {
          throw new Error("Invalid user role");
        }

        let queryParams = {};

        if (roleName === "Authenticated" || roleName === "authenticated") {
          console.log("Admin");
          queryParams = {
            filters: {
              $or: [
                {
                  rent_records: {
                    $null: true,
                  },
                },
                {
                  rent_records: {
                    end_date: { $lt: startDate },
                  },
                },
                {
                  rent_records: {
                    start_date: { $gt: endDate },
                  },
                },
              ],
            },
            populate: {
              owner: {
                fields: ["username"],
              },
              rent_records: {
                fields: ["start_date", "end_date"],
                populate: {
                  renter: {
                    fields: ["username"],
                  },
                },
              },
            },
          };
        } else {
          throw new Error("Insufficient permissions");
        }

        const entities = await strapi.entityService.findMany(
          "api::appartment.appartment",
          {
            ...queryParams,
          }
        );

        if (!entities || entities.length === 0) {
          throw new Error("No apartments found");
        }

        return { results: entities };
      } catch (error) {
        strapi.log.error("Service error in apartment findAvailable:", error);
        throw error;
      }
    },

    async findRented({ user }: { user: StrapiUser }) {
      try {
        const roleName = user.role?.name;
        if (!roleName) {
          throw new Error("Invalid user role");
        }

        let queryParams = {};

        if (roleName === "Authenticated" || roleName === "authenticated") {
          console.log("Authenticated");
          queryParams = {
            filters: {
              rent_records: {
                renter: {
                  id: user.id,
                },
              },
            },
            populate: {
              owner: {
                fields: ["username"],
              },
              rent_records: {
                fields: ["start_date", "end_date"],
                populate: {
                  renter: {
                    fields: ["username"],
                  },
                },
              },
            },
          };
        } else {
          throw new Error("Insufficient permissions");
        }

        const entities = await strapi.entityService.findMany(
          "api::appartment.appartment",
          {
            ...queryParams,
          }
        );

        return { results: entities };
      } catch (error) {
        strapi.log.error("Service error in apartment findRented:", error);
        throw error;
      }
    },
  })
);
