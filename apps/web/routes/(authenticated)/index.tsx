import { Button } from "../../components/Button.tsx";
import { define } from "../../utils.ts";

export default define.page(function Home() {
  return (
    <div class="p-4 mx-auto">
      <h1 class="text-4xl font-bold mb-2">Your Rooms</h1>
      <Button onClick={() => console.log("Create a room")}>
        Create a Room
      </Button>
    </div>
  );
});
