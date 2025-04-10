import { beforeAll, describe, it } from "@std/testing/bdd";
import { assertRejects } from "@std/assert";
import type { GetAuthProviderUserResponse } from "./get-auth-provider-user.response.ts";
import {
  ERROR_INVALID_COMMAND,
  ERROR_USER_NOT_FOUND,
  GetAuthProviderUserCommandHandler,
} from "./get-auth-provider-user.command-handler.ts";
import { GetAuthProviderUserCommand } from "./get-auth-provider-user.command.ts";

describe("GetAuthProviderUserCommandHandler", () => {
  let sut: GetAuthProviderUserCommandHandler;

  const setupSut = (
    sutOptions: {
      getAuthProviderUserResponse?: Partial<GetAuthProviderUserResponse>;
    } = {},
  ) => {
    const dataAccess = {
      getUserByAccessToken: () =>
        Promise.resolve({
          id: 1,
          nodeId: "nodeId",
          login: "login",
          name: "name",
          avatarUrl: "avatarUrl",
          ...sutOptions.getAuthProviderUserResponse,
        } as GetAuthProviderUserResponse),
    };

    sut = new GetAuthProviderUserCommandHandler(
      dataAccess,
    );
  };

  describe("execute", () => {
    describe("when command is invalid", () => {
      beforeAll(() => {
        setupSut();
      });

      describe("when accessToken is missing", () => {
        it("throws an error", async () => {
          // Arrange
          const command = buildCommand("");

          // Act
          const execution = () => sut.execute(command);

          // Assert
          await assertRejects(
            execution,
            TypeError,
            ERROR_INVALID_COMMAND,
          );
        });
      });

      describe("when login is missing from response", () => {
        it("throws an error", async () => {
          // Arrange
          setupSut({
            getAuthProviderUserResponse: {
              login: undefined,
            },
          });

          const command = buildCommand("accessToken");

          // Act
          const execution = () => sut.execute(command);

          // Assert
          await assertRejects(
            execution,
            TypeError,
            ERROR_USER_NOT_FOUND,
          );
        });
      });
    });
  });
});

function buildCommand(accessToken: string): GetAuthProviderUserCommand {
  return new GetAuthProviderUserCommand(
    "github",
    accessToken,
  );
}
