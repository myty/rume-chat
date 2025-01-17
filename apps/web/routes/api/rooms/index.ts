import { define } from "../../../utils.ts";
import { CreateRoomCommand } from "@myty/fresh-workspace-domain/rooms/create";

export const handler = define.handlers({
  // Index
  GET() {
    throw new Error("Not implemented");
  },

  // Create
  async POST(ctx) {
    try {
      const commandHandler = ctx.state.container.resolve(
        "CreateRoomCommandHandler",
      );

      const { id, name, ownerId } = await ctx.req.json();
      const command = new CreateRoomCommand(id, name, ownerId);

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
