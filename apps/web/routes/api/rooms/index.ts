import { define } from "@/utils.ts";
import { GetUserRoomsQuery } from "@myty/fresh-workspace-domain/rooms/get-user-rooms";
import { CreateRoomCommand } from "@myty/fresh-workspace-domain/rooms/create-room";

export const handler = define.handlers({
  // Index
  async GET(ctx) {
    try {
      const queryHandler = ctx.state.container.resolve(
        "GetUserRoomsQueryHandler",
      );
      const query = new GetUserRoomsQuery(ctx.state.currentUser.handle);
      const response = await queryHandler.handle(query);

      if (!response) {
        return new Response("Room not found", { status: 404 });
      }

      return new Response(JSON.stringify(response));
    } catch (error) {
      if (error instanceof TypeError) {
        return new Response(error.message, { status: 400 });
      }

      return new Response("Internal server error", { status: 500 });
    }
  },

  // Create
  async POST(ctx) {
    try {
      const commandHandler = ctx.state.container.resolve(
        "CreateRoomCommandHandler",
      );

      const { id, name } = await ctx.req.json();
      const command = new CreateRoomCommand(
        id,
        name,
        ctx.state.currentUser.handle,
      );

      const room = await commandHandler.execute(command);

      return new Response(JSON.stringify(room));
    } catch (error) {
      if (error instanceof TypeError) {
        return new Response(error.message, { status: 400 });
      }

      console.error(error);
      return new Response("Internal server error", { status: 500 });
    }
  },
});
