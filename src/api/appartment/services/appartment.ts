/**
 * appartment service
 */

import { factories } from "@strapi/strapi";

interface FindParams {
  user: any;
  query?: any;
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
  })
);
