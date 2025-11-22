import { Button, Input, Spinner } from "@/components/atoms";
import type { CreatePostData, User } from "@/lib/types";
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/api/client";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { MAX_NUMBER, MIN_NUMBER } from "@/lib/constants";
import { getColor } from "@/lib/utils";

export const CreatePost = ({ user: { id, username } }: { user: User }) => {
  const queryClient = useQueryClient();

  const [startingNumber, setStartingNumber] = useState<string>();
  const [error, setError] = useState<string>("");

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreatePostData) => apiClient.post("/operations", data),
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(
        <p className="text-base text-start">{`An error occurred. ${
          message || "Please try again"
        }`}</p>
      );
    },
    onSuccess: () => {
      toast.success(
        <p className="text-base text-start">
          Your number is ready for operation!
        </p>
      );
      queryClient.invalidateQueries({ queryKey: ["operations"] });
      reset();
    },
  });

  const disablePost = useMemo(
    () => isPending || !!error || !startingNumber,
    [error, isPending, startingNumber]
  );

  const handleStartingNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartingNumber(e.target.value);

    if (Number(e.target.value) > MAX_NUMBER) {
      setError(`It's over ${MAX_NUMBER}!`);
    } else if (Number(e.target.value) < MIN_NUMBER) {
      setError(`It's below ${MIN_NUMBER}!`);
    } else {
      setError("");
    }
  };

  const reset = () => {
    setStartingNumber("");
    setError("");
  };

  return (
    <div className="flex flex-col border-y border-[#2f3336] p-5">
      <div className="flex flex-row">
        <div
          className={`rounded-full min-h-10 content-center min-w-10 border ${getColor(
            id
          )}`}
        >
          {username.slice(0, 2).toUpperCase()}
        </div>
        <Input
          type="number"
          placeholder="What number is on your mind?"
          className="border-none text-lg!"
          max={MAX_NUMBER}
          min={MIN_NUMBER}
          onChange={handleStartingNumberChange}
        />
      </div>
      <div className="w-full flex justify-end items-center gap-4">
        <p className="text-[0.85rem] text-red-500">{error}</p>
        <Button
          className="rounded-full font-semibold"
          onClick={() => mutate({ value: Number(startingNumber) })}
          disabled={disablePost}
          size="lg"
        >
          {isPending && <Spinner />}
          Post
        </Button>
      </div>
    </div>
  );
};
