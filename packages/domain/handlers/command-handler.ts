export interface CommandHandler<TCommand, TResponse> {
  execute(command: TCommand): Promise<TResponse>;
}
