import { beforeAll, describe, it } from "@std/testing/bdd";
import {
  ERROR_INVALID_COMMAND,
  ERROR_USER_NOT_FOUND,
  LoginUserByProviderCommandHandler,
} from "./login-user-by-provider.command-handler.ts";
import { assertEquals, assertRejects } from "@std/assert";
import { LoginUserByProviderCommand } from "./login-user-by-provider.command.ts";
import type { GetAuthProviderUserResponse } from "../../auth-providers/get-auth-provider-user/get-auth-provider-user.response.ts";
import type { LoginUserByProviderResponse } from "./login-user-by-provider.response.ts";

describe("LoginUserByProviderCommandHandler", () => {
  let sut: LoginUserByProviderCommandHandler;

  const setupSut = (
    sutOptions: {
      loginUserByProviderResponse?: Partial<LoginUserByProviderResponse>;
      getAuthProviderUserResponse?: Partial<GetAuthProviderUserResponse>;
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

    const authProviderDataAccess = {
      getUserByAccessToken: () =>
        Promise.resolve({
          login: "login",
          name: "name",
          avatarUrl: "avatarUrl",
          ...sutOptions.getAuthProviderUserResponse,
        }),
    };

    sut = new LoginUserByProviderCommandHandler(
      dataAccess,
      authProviderDataAccess,
    );
  };

  describe("execute", () => {
    describe("when command is invalid", () => {
      beforeAll(() => {
        setupSut();
      });

      describe("when access token is missing", () => {
        it("throws an error", async () => {
          // Arrange
          const command = new LoginUserByProviderCommand(
            "github",
            "",
            "sessionId",
          );

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

      describe("when sessionId is missing", () => {
        it("throws an error", async () => {
          // Arrange
          const command = new LoginUserByProviderCommand(
            "github",
            "accessToken",
            "",
          );

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

    describe("when authProviderUser is not found", () => {
      const command = new LoginUserByProviderCommand(
        "github",
        "accessToken",
        "sessionId",
      );

      it("throws an error", async () => {
        // Arrange
        setupSut({
          getAuthProviderUserResponse: { login: "" },
        });

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

    it("returns the user data", async () => {
      // Arrange
      setupSut();

      // Act
      const result = await sut.execute(
        new LoginUserByProviderCommand(
          "github",
          "accessToken",
          "sessionId",
        ),
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
