import {
  type QueryClient,
  useSuspenseQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import {
  activeRoomsQueryOptions,
  createRoomMutationOptions,
} from "../shared/rooms.ts";
import Card from "../../components/card.tsx";
import { Button } from "../../components/button.tsx";
import { PlusIcon } from "@heroicons/react/16/solid";
import type { Room } from "../shared/rooms.ts";
import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import Input from "../../components/input.tsx";

export const dashboardLoader = async (queryClient: QueryClient) => {
  const activeRooms = await queryClient.ensureQueryData(
    activeRoomsQueryOptions,
  );

  return { activeRooms };
};

export const Dashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { isPending, isError, mutate } = useMutation(
    createRoomMutationOptions(queryClient),
  );
  const activeRoomsQuery = useSuspenseQuery(activeRoomsQueryOptions);
  const activeRooms = activeRoomsQuery.data;

  const [isCreateRoomDialogOpen, setIsCreateRoomDialogOpen] = useState(false);
  const [newRoom, setNewRoom] = useState<Room>();

  const handleOpenCreateRoomDialog = () => {
    if (!isError) {
      setNewRoom(undefined);
    }

    setIsCreateRoomDialogOpen(true);
  };

  const handleCreateRoom = () => {
    mutate(newRoom);
    setIsCreateRoomDialogOpen(false);
  };

  const handleCloseCreateRoomDialog = () => {
    setNewRoom(undefined);
    setIsCreateRoomDialogOpen(false);
  };

  useEffect(() => {
    if (isError) {
      handleOpenCreateRoomDialog();
    }
  }, [isError]);

  return (
    <>
      <div>
        <h1 className="text-4xl font-bold">Active Rooms</h1>
        <div className="flex gap-4 flex-wrap py-4">
          {activeRooms.map((room) => (
            <Card
              key={room.id}
              className="border-dashed border border-gray-500 rounded-lg h-48 w-48 text-sm p-2">
              <h2 className="font-semibold">{room.name}</h2>
              <p className="text-xs font-semibold text-slate-500">
                {room.currentUserCount ?? 2} active users
              </p>
            </Card>
          ))}
          {isPending && newRoom && (
            <Card className="border-dashed border border-gray-500 text-gray-500 rounded-lg h-48 w-48 text-sm">
              <h2 className="font-semibold p-2 ">{newRoom.name}</h2>
              <h2>{newRoom.name}</h2>
              <p>1 active user</p>
            </Card>
          )}
          {!isPending && (
            <Button
              className="border-dashed border border-gray-500 rounded-lg h-48 w-48 cursor-pointer"
              onClick={handleOpenCreateRoomDialog}>
              <h2 className="text-sm font-semibold flex items-center justify-center">
                <PlusIcon className="size-4 mr-1" /> Create a Room
              </h2>
            </Button>
          )}
        </div>
      </div>

      <Dialog
        open={isCreateRoomDialogOpen}
        onClose={handleCloseCreateRoomDialog}
        className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:size-10">
                  <CheckCircleIcon
                    aria-hidden="true"
                    className="size-6 text-green-600"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900">
                    Create Room
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      This will create a new room in the active rooms list.
                    </p>
                    <Input
                      id="room-id"
                      label="Room Id"
                      value={newRoom?.id}
                      onChange={(evt) =>
                        setNewRoom((prev) => ({
                          ...prev,
                          id: evt.target.value,
                        }))
                      }
                    />
                    <Input
                      id="room-name"
                      label="Friendly Room Name"
                      value={newRoom?.name}
                      onChange={(evt) =>
                        setNewRoom((prev) => ({
                          ...prev,
                          name: evt.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:ml-10 sm:flex sm:pl-4">
                <button
                  type="button"
                  onClick={handleCreateRoom}
                  className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:w-auto">
                  Create Room
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={handleCloseCreateRoomDialog}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto">
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};
