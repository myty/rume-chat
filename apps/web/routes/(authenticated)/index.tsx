import { define } from "../../utils.ts";
import YourRooms from "./(_islands)/YourRooms.tsx";
import { rooms } from "../../state/rooms.ts";

export default define.page(function Home() {
  return (
    <div class="p-4 mx-auto">
      <YourRooms rooms={rooms} />
    </div>
  );
});
