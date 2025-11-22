import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Spinner,
} from "@/components/atoms";
import { X } from "lucide-react";
import type { Operation, OperationType, ReplyData, User } from "@/lib/types";
import { useMemo, useState } from "react";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/api/client";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { formatTimeAgo, getColor } from "@/lib/utils";
import { MAX_NUMBER, MIN_NUMBER } from "@/lib/constants";

export const ReplyModal = ({
  post,
  user,
  open,
  onOpenChange,
}: { post: Operation; user?: User } & DialogProps) => {
  const queryClient = useQueryClient();

  const [replyNumber, setReplyNumber] = useState<string>();
  const [replyOperation, setReplyOperation] = useState<OperationType>("ADD");
  const [error, setError] = useState<string>("");

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ReplyData) =>
      apiClient.post(`/operations/${post.id}/reply`, data),
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(
        <p className="text-base text-start">{`Reply failed. ${
          message || "Please try again"
        }`}</p>
      );
    },
    onSuccess: () => {
      toast.success(
        <p className="text-base text-start">Arithmetic ran successfully!</p>
      );
      queryClient.invalidateQueries({ queryKey: ["operations"] });
      onOpenChange?.(false);
    },
  });

  const disableReply = useMemo(
    () => isPending || !!error || !replyNumber,
    [error, isPending, replyNumber]
  );

  const handleReplyNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplyNumber(e.target.value);

    if (Number(e.target.value) > MAX_NUMBER) {
      setError(`It's over ${MAX_NUMBER}!`);
    } else if (Number(e.target.value) < MIN_NUMBER) {
      setError(`It's below ${MIN_NUMBER}!`);
    } else {
      setError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="bg-black border border-[#2f3336] shadow-2xl"
      >
        <div className="flex flex-col gap-8 text-white pb-5 px-5">
          <DialogClose
            asChild
            className="bg-transparent absolute top-5 right-4 border-none rounded-full"
          >
            <Button variant="outline" size="icon">
              <X />
            </Button>
          </DialogClose>
          <div className="flex flex-col items-start gap-4 w-full">
            <DialogTitle className="text-2xl font-extrabold text-center">
              Run the numbers
            </DialogTitle>
            <div
              key={post.id}
              className="flex flex-row gap-3 items-start w-full"
            >
              <div className="flex flex-col items-center gap-2 h-full">
                <div
                  className={`rounded-full min-h-10 min-w-10 content-center text-center border ${getColor(
                    post.userId
                  )}`}
                >
                  {post.user.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="h-full w-px bg-muted-foreground/65" />
              </div>
              <div className="flex flex-col gap-1 items-start w-full">
                <div className="flex flex-row items-center gap-2 text-muted-foreground text-sm">
                  <p>@{post.user.username}</p>
                  <div className="size-[3px] bg-muted-foreground" />
                  <p>{formatTimeAgo(post.createdAt)}</p>
                </div>
                <p>{post.value}</p>
                <div className="text-sm text-muted-foreground flex gap-1">
                  <p>Replying to</p>
                  <DialogDescription className="text-teal-500">
                    @{post.user.username}
                  </DialogDescription>
                </div>
              </div>
            </div>
            {user && (
              <div className="flex flex-col w-full">
                <div className="flex flex-row">
                  <div
                    className={`rounded-full min-h-10 min-w-10 max-h-min content-center text-center border ${getColor(
                      user.id
                    )}`}
                  >
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col w-full">
                    <Input
                      type="number"
                      placeholder="What number is on your mind?"
                      className="border-none text-lg!"
                      max={MAX_NUMBER}
                      min={MIN_NUMBER}
                      onChange={handleReplyNumberChange}
                    />
                    <Select
                      defaultValue="ADD"
                      value={replyOperation}
                      onValueChange={(value: OperationType) =>
                        setReplyOperation(value)
                      }
                    >
                      <SelectTrigger className="w-min dark ml-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="dark">
                        <SelectGroup>
                          <SelectLabel>Operations</SelectLabel>
                          <SelectItem value="ADD">Add</SelectItem>
                          <SelectItem value="SUB">Subtract</SelectItem>
                          <SelectItem value="MUL">Multiply</SelectItem>
                          <SelectItem value="DIV">Divide</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="w-full flex justify-end items-center gap-4">
                  <p className="text-[0.85rem] text-red-500">{error}</p>
                  <Button
                    variant="secondary"
                    className="rounded-full font-semibold"
                    onClick={() =>
                      mutate({
                        op: replyOperation,
                        rightValue: Number(replyNumber),
                      })
                    }
                    disabled={disableReply}
                    size="lg"
                  >
                    {isPending && <Spinner />}
                    Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
