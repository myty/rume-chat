import { render } from "ink";
import { AppProvider } from "./app-provider.tsx";
import { Rooms } from "./rooms.tsx";

render(
  <AppProvider>
    <Rooms />
  </AppProvider>,
);
