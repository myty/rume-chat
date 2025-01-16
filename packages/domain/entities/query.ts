export interface QueryHandler<TQuery, TResponse> {
  handle(query: TQuery): Promise<TResponse>;
}
