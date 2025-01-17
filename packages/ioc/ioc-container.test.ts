import {
  assert,
  assertNotEquals,
  assertNotStrictEquals,
  assertStrictEquals,
} from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { IoCContainer } from "./ioc-container.ts";
import { Lifecycle } from "./ioc-container.ts";

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

    it("should share singleton registrations with parent container", () => {
      // Arrange
      const container = IoCContainer
        .create<TEST_DI_TYPES>()
        .bind(
          "TestInterface",
          () => new TestClass(),
          Lifecycle.Singleton,
        )
        .build();

      const testInstance = container.resolve("TestInterface");

      // Act
      using scope = container.beginScope();
      const testInstanceFromScope = scope.resolve("TestInterface");

      // Assert
      assertStrictEquals(testInstanceFromScope, testInstance);
    });
  });

  describe("resolve", () => {
    it("should resolve a transient registration", () => {
      // Arrange
      const container = IoCContainer
        .create<TEST_DI_TYPES>()
        .bind(
          "TestInterface",
          () => new TestClass(),
          Lifecycle.Transient,
        )
        .build();

      // Act
      const testInstance = container.resolve("TestInterface");

      // Assert
      assert(testInstance instanceof TestClass);
    });

    it("should resolve a new transient value with each resolution", () => {
      // Arrange
      const container = IoCContainer
        .create<TEST_DI_TYPES>()
        .bind(
          "TestInterface",
          () => new TestClass(),
          Lifecycle.Transient,
        )
        .build();

      // Act
      const testInstanceOne = container.resolve("TestInterface");
      const testInstanceTwo = container.resolve("TestInterface");

      // Assert
      assertNotStrictEquals(testInstanceOne, testInstanceTwo);
    });

    it("should resolve a singleton registration", () => {
      // Arrange
      const container = IoCContainer
        .create<TEST_DI_TYPES>()
        .bind(
          "TestInterface",
          () => new TestClass(),
          Lifecycle.Singleton,
        )
        .build();

      // Act
      const testInstance = container.resolve("TestInterface");

      // Assert
      assert(testInstance instanceof TestClass);
    });

    it("should resolve a scoped registration", () => {
      // Arrange
      const container = IoCContainer
        .create<TEST_DI_TYPES>()
        .bind(
          "TestInterface",
          () => new TestClass(),
          Lifecycle.Scoped,
        )
        .build();

      // Act
      using scope = container.beginScope();
      const testInstance = scope.resolve("TestInterface");

      // Assert
      assert(testInstance instanceof TestClass);
    });

    it("should not resolve a scoped registration from parent container", () => {
      // Arrange
      const container = IoCContainer
        .create<TEST_DI_TYPES>()
        .bind(
          "TestInterface",
          () => new TestClass(),
          Lifecycle.Scoped,
        )
        .build();

      const testInstance = container.resolve("TestInterface");

      // Act
      using scope = container.beginScope();
      const testInstanceFromScope = scope.resolve("TestInterface");

      // Assert
      assertNotStrictEquals(testInstanceFromScope, testInstance);
    });

    it("should not resolve a transient registration from parent container", () => {
      // Arrange
      const container = IoCContainer
        .create<TEST_DI_TYPES>()
        .bind(
          "TestInterface",
          () => new TestClass(),
          Lifecycle.Transient,
        )
        .build();

      const testInstance = container.resolve("TestInterface");

      // Act
      using scope = container.beginScope();
      const testInstanceFromScope = scope.resolve("TestInterface");

      // Assert
      assertNotStrictEquals(testInstanceFromScope, testInstance);
    });
  });
});

interface TestInterface {
  test(): void;
}

class TestClass implements TestInterface {
  test(): void {}
}

interface TEST_DI_TYPES {
  TestInterface: TestInterface;
}
