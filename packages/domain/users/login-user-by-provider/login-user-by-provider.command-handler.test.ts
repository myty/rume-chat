import { beforeAll, describe, it } from "@std/testing/bdd";
import {
  ERROR_INVALID_COMMAND,
  LoginUserByProviderCommandHandler,
} from "./login-user-by-provider.command-handler.ts";
import { assertEquals, assertRejects } from "@std/assert";
import { LoginUserByProviderCommand } from "./login-user-by-provider.command.ts";
import type { LoginUserByProviderResponse } from "./login-user-by-provider.response.ts";

describe("LoginUserByProviderCommandHandler", () => {
  let sut: LoginUserByProviderCommandHandler;

  const setupSut = (
    sutOptions: {
      loginUserByProviderResponse?: Partial<LoginUserByProviderResponse>;
    } = {},
  ) => {
    const dataAccess = {
      loginUser: () =>
        Promise.resolve({
          handle: "handle",
          sessionId: "sessionId",
          name: "name",
          ...sutOptions.loginUserByProviderResponse,
        }),
    };

    sut = new LoginUserByProviderCommandHandler(
      dataAccess,
    );
  };

  describe("execute", () => {
    describe("when command is invalid", () => {
      beforeAll(() => {
        setupSut();
      });

      describe("when sessionId is missing", () => {
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
    });

    it("returns the user data", async () => {
      // Arrange
      const command = buildCommand("sessionId");
      setupSut();

      // Act
      const result = await sut.execute(
        command,
      );

      // Assert
      assertEquals(result, {
        handle: "handle",
        sessionId: "sessionId",
        name: "name",
      });
    });
  });
});

function buildCommand(sessionId: string): LoginUserByProviderCommand {
  return new LoginUserByProviderCommand(
    sessionId,
    {
      avatarUrl: "avatarUrl",
      id: 1,
      login: "login",
      name: "name",
      nodeId: "nodeId",
    },
  );
}
