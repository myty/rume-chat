import type { CommandHandler } from "../../handlers";
import type { CreateMessageCommand } from "./create-message.command.ts";
import type { CreateMessageModel } from "./create-message.model.ts";
import type { CreateMessageResponse } from "./create-message.response.ts";
import type { CreateMessageService } from "./create-message.service.ts";

export interface CreateMessageDataAccess {
  createMessage(command: CreateMessageModel): Promise<CreateMessageResponse>;
}

export class CreateMessageCommandHandler
  implements CommandHandler<CreateMessageCommand, CreateMessageResponse> {
  constructor(
    private readonly dataAccess: CreateMessageDataAccess,
    private readonly createMessageService: CreateMessageService,
  ) {}

  async execute(command: CreateMessageCommand): Promise<CreateMessageResponse> {
    const model = this.createMessageService.execute(command);
    const response = await this.dataAccess.createMessage(model);

    return response;
  }
}
