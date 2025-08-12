/**
 * appartment controller
 */

import { factories } from "@strapi/strapi";
import { Context } from "koa";

export default factories.createCoreController(
  "api::appartment.appartment",
  ({ strapi }) => ({
    async find(ctx: Context) {
      try {
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized(
            "You must be authenticated to access this endpoint"
          );
        }

        const result = await strapi
          .service("api::appartment.appartment")
          .find({ ctx, user });

        return { data: result };
      } catch (error) {
        strapi.log.error("Controller error in apartment find:", error);

        if (error.message === "Insufficient permissions") {
          return ctx.forbidden("You don't have enough permissions!");
        }

        if (error.message === "Invalid user role") {
          return ctx.badRequest("Invalid user role");
        }

        return ctx.internalServerError(
          "Server error while fetching apartments"
        );
      }
    },
  })
);
