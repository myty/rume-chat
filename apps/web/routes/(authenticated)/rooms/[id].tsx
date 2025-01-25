import { PageProps } from "fresh";
import Room from "@islands/Room.tsx";
import { define } from "@/utils.ts";

export default define.page(function Streams(props: PageProps) {
  return (
    <div class="px-4 py-8 mx-auto">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <h1 class="text-4xl font-bold">Room {props.params.id}</h1>
        <Room id={props.params.id} />
      </div>
    </div>
  );
});
