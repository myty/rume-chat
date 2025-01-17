export interface CommandHandler<TCommand, TResponse> {
  execute(query: TCommand): Promise<TResponse>;
}
