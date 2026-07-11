type Messages = Record<string, unknown>;

export function pickClientMessages(
  messages: Messages,
  namespaces: readonly string[],
) {
  return Object.fromEntries(
    namespaces
      .filter((namespace) => namespace in messages)
      .map((namespace) => [namespace, messages[namespace]]),
  );
}
