import type { CreateRoomCommand } from "@myty/fresh-workspace-domain";

export class Room {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly ownerHandle: string,
  ) {}

  static fromCommand(command: CreateRoomCommand): Room {
    return new Room(command.roomId, command.name, command.ownerHandle);
  }
}
