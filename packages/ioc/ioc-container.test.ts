import { assertEquals, assertNotEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { IoCContainer } from "./ioc-container.ts";
import type { BindableIoCContainer } from "./ioc-container.ts";

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

  describe("addModule", () => {
    it("should register types from a module and resolve them", () => {
      // Arrange: define a module
      const expectedValue = "test-value";
      const module = (c: BindableIoCContainer<{ TestType: string }>) => {
        c.bind("TestType", () => expectedValue);
      };
      const container = IoCContainer.create().addModule(module).build();

      // Act
      const value = container.resolve("TestType");

      // Assert
      assertEquals(value, expectedValue);
    });

    it("should allow chaining addModule calls", () => {
      // Arrange: define two modules
      const expectedValueA = 1;
      const expectedValueB = 2;
      const moduleA = (c: BindableIoCContainer<{ A: number }>) => {
        c.bind("A", () => expectedValueA);
      };
      const moduleB = (c: BindableIoCContainer<{ B: number }>) => {
        c.bind("B", () => expectedValueB);
      };
      const container = IoCContainer.create().addModule(moduleA).addModule(
        moduleB,
      ).build();

      // Act & Assert
      assertEquals(container.resolve("A"), expectedValueA);
      assertEquals(container.resolve("B"), expectedValueB);
    });
  });
});
