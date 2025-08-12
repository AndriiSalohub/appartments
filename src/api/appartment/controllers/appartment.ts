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

        const { results } = await strapi
          .service("api::appartment.appartment")
          .find({ user });

        return { data: results };
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

    async findOne(ctx: Context) {
      try {
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized(
            "You must be authenticated to access this endpoint"
          );
        }

        const { id } = ctx.params;

        const result = await strapi
          .service("api::appartment.appartment")
          .findOne(id, { user });

        return { data: result };
      } catch (error) {
        strapi.log.error("Controller error in apartment findOne:", error);

        if (error.message === "Insufficient permissions") {
          return ctx.forbidden("You don't have enough permissions!");
        }

        if (error.message === "Invalid user role") {
          return ctx.badRequest("Invalid user role");
        }

        if (error.message === "Apartment not found") {
          return ctx.notFound("Apartment not found or access denied");
        }

        return ctx.internalServerError("Server error while fetching apartment");
      }
    },
  })
);
