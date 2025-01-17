import { assertRejects } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import {
  CreateRoomCommandHandler,
  type CreateRoomDataAccess,
} from "./create-room.command-handler.ts";
import { CreateRoomCommand } from "./create-room.command.ts";
import { assertSpyCalls, spy } from "@std/testing/mock";

describe("CreateRoomCommandHandler", () => {
  it("should throw an error when the room id is empty", async () => {
    // Arrange
    const { createRoom, commandHandler } = setupSut();
    const command = new CreateRoomCommand("", "Room Name", "owner-id");

    // Act, Assert
    await assertRejects(
      async () => await commandHandler.execute(command),
      Error,
      "ID",
    );
    assertSpyCalls(createRoom, 0);
  });

  it("should throw an error when the room name is empty", async () => {
    // Arrange
    const { createRoom, commandHandler } = setupSut();
    const command = new CreateRoomCommand("room-id", "", "owner-id");

    // Act, Assert
    await assertRejects(
      async () => await commandHandler.execute(command),
      Error,
      "name",
    );
    assertSpyCalls(createRoom, 0);
  });
});

function setupSut() {
  const createRoom = spy();
  const dataAccess = { createRoom } as unknown as CreateRoomDataAccess;
  const commandHandler = new CreateRoomCommandHandler(dataAccess);
  return { createRoom, commandHandler };
}
