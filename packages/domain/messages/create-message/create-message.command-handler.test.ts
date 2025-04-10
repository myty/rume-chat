import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertRejects } from "@std/assert";
import { CreateMessageCommand } from "./create-message.command.ts";
import {
  CreateMessageCommandHandler,
  ERROR_INVALID_COMMAND_MESSAGE,
  ERROR_INVALID_COMMAND_ROOM_ID,
  ERROR_INVALID_COMMAND_USER_HANDLE,
} from "./create-message.command-handler.ts";
import { CreateMessageResponse } from "./create-message.response.ts";

describe("CreateMessageCommandHandler", () => {
  let sut: CreateMessageCommandHandler;

  beforeEach(() => {
    sut = setupSut();
  });

  describe("execute", () => {
    describe("when roomId is missing", () => {
      it("throws an error", async () => {
        // Arrange
        const command = buildCommand({ roomId: "" });

        // Act
        const execution = () => sut.execute(command);

        // Assert
        await assertRejects(
          execution,
          TypeError,
          ERROR_INVALID_COMMAND_ROOM_ID,
        );
      });
    });

    describe("when message is missing", () => {
      it("throws an error", async () => {
        // Arrange
        const command = buildCommand({ message: "" });

        // Act
        const execution = () => sut.execute(command);

        // Assert
        await assertRejects(
          execution,
          TypeError,
          ERROR_INVALID_COMMAND_MESSAGE,
        );
      });
    });

    describe("when userHandle is missing", () => {
      it("throws an error", async () => {
        // Arrange
        const command = buildCommand({ userHandle: "" });

        // Act
        const execution = () => sut.execute(command);

        // Assert
        await assertRejects(
          execution,
          TypeError,
          ERROR_INVALID_COMMAND_USER_HANDLE,
        );
      });
    });
  });
});

function setupSut() {
  const dataAccess = {
    createMessage(
      command: CreateMessageCommand,
    ): Promise<CreateMessageResponse> {
      return Promise.resolve(
        new CreateMessageResponse(
          "id",
          command.roomId,
          command.message,
          command.userHandle,
          new Date(),
        ),
      );
    },
  };

  return new CreateMessageCommandHandler(dataAccess);
}

function buildCommand(
  command: Partial<CreateMessageCommand> = {},
): CreateMessageCommand {
  const values = {
    roomId: "roomId",
    message: "message",
    userHandle: "userHandle",
    ...command,
  };

  return new CreateMessageCommand(
    values.roomId,
    values.message,
    values.userHandle,
  );
}
