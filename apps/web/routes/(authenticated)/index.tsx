import { useSignal } from "@preact/signals";
import { define } from "../../utils.ts";
import YourRooms from "../../islands/YourRooms.tsx";

export default define.page(function Home() {
  const rooms = useSignal(["Engineering Managers", "OSS", "Pairing Room #1"]);

  return (
    <div class="p-4 mx-auto">
      <YourRooms rooms={rooms} />
    </div>
  );
});
