import { assertNotEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { IoCContainer } from "./ioc-container.ts";

describe("IoCContainer", () => {
  it("should dispose the container", () => {
    // Arrange
    const container = IoCContainer.create();

    // Act, Assert
    container.dispose();
  });

  describe("beginScope", () => {
    it("should create a new container scope", () => {
      // Arrange
      const container = IoCContainer.create().build();

      // Act
      const scope = container.beginScope();

      // Assert
      assertNotEquals(scope, container);
    });
  });
});
