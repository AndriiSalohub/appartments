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

        if (!id) {
          return ctx.badRequest("Apartment ID is required");
        }

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

    async findAvailable(ctx: Context) {
      try {
        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized(
            "You must be authenticated to access this endpoint"
          );
        }

        const { startDate, endDate } = ctx.query;
        if (!startDate || !endDate) {
          return ctx.badRequest("startDate and endDate are required");
        }

        const { results } = await strapi
          .service("api::appartment.appartment")
          .findAvailable({ user, startDate, endDate });

        return { data: results };
      } catch (error) {
        strapi.log.error("Controller error in apartment findAvailable:", error);
        if (error.message === "Insufficient permissions") {
          return ctx.forbidden("You don't have enough permissions!");
        }

        if (error.message === "Invalid user role") {
          return ctx.badRequest("Invalid user role");
        }

        if (error.message === "No apartments found") {
          return ctx.notFound("Apartment not found or access denied");
        }

        return ctx.internalServerError(
          "Server error while fetching available apartments"
        );
      }
    },

    async findRented(ctx) {
      try {
        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized(
            "You must be authenticated to access this endpoint"
          );
        }

        const { results } = await strapi
          .service("api::appartment.appartment")
          .findRented({ user });

        return { data: results };
      } catch (error) {
        strapi.log.error("Controller error in apartment findRented:", error);
        if (error.message === "Insufficient permissions") {
          return ctx.forbidden("You don't have enough permissions!");
        }

        if (error.message === "Invalid user role") {
          return ctx.badRequest("Invalid user role");
        }

        return ctx.internalServerError(
          "Server error while fetching rented apartments"
        );
      }
    },

    async rentAppartment(ctx: any) {
      try {
        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized(
            "You must be authenticated to rent an apartment"
          );
        }

        const { id } = ctx.params;

        if (!id) {
          return ctx.badRequest("Apartment ID is required");
        }

        const { startDate, endDate } = ctx.request.body;

        if (!startDate || !endDate) {
          return ctx.badRequest("startDate and endDate are required");
        }

        const { results } = await strapi
          .service("api::appartment.appartment")
          .rentAppartment({ user, appartmentId: id, startDate, endDate });

        return { data: results };
      } catch (error) {
        strapi.log.error(
          "Controller error in apartment rentAppartment:",
          error
        );
        if (error.message === "Insufficient permissions") {
          return ctx.forbidden("You don't have enough permissions!");
        }

        if (error.message === "Invalid user role") {
          return ctx.badRequest("Invalid user role");
        }

        if (error.message === "Apartment not found") {
          return ctx.notFound("Apartment not found");
        }

        if (error.message === "Apartment already rented") {
          return ctx.badRequest(
            "Apartment is already rented for the selected period"
          );
        }

        return ctx.internalServerError("Server error while renting apartment");
      }
    },

    async delete(ctx: Context) {
      try {
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized(
            "You must be authenticated to delete an apartment"
          );
        }

        const { id } = ctx.params;

        if (!id) {
          return ctx.badRequest("Apartment ID is required");
        }

        const deletedEntity = await strapi
          .service("api::appartment.appartment")
          .delete(id, { user });

        return ctx.send({
          message: "Apartment deleted successfully",
          data: deletedEntity,
        });
      } catch (error) {
        strapi.log.error("Controller error in apartment delete:", error);

        if (error.message === "Insufficient permissions") {
          return ctx.forbidden("You don't have enough permissions!");
        }

        if (error.message === "Invalid user role") {
          return ctx.badRequest("Invalid user role");
        }

        if (error.message === "Apartment not found") {
          return ctx.notFound("Apartment not found");
        }

        if (
          error.message ===
          "Cannot delete apartment with active or planned rent records"
        ) {
          return ctx.badRequest(
            "Cannot delete apartment with active or planned rent records"
          );
        }

        return ctx.internalServerError("Failed to delete apartment");
      }
    },
  })
);
