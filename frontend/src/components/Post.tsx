import { Button, Spinner } from "@/components/atoms";
import { useState } from "react";
import { formatTimeAgo, getColor, getOperationText } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import type { Operation, User } from "@/lib/types";
import { ReplyModal } from "./ReplyModal";
import { toast } from "sonner";
import apiClient from "@/api/client";
import { useQuery } from "@tanstack/react-query";

export const Post = ({
  post,
  user,
  className = "",
}: {
  post: Operation;
  user?: User;
  className?: string;
}) => {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState<boolean>(false);
  const [isShowingReplies, setIsShowingReplies] = useState<boolean>(false);

  const { data: replies, isLoading } = useQuery<Operation[]>({
    queryKey: ["operations", post.id, "replies"],
    queryFn: async () => {
      const res = await apiClient.get(`/operations/${post.id}/replies`);
      return res.data;
    },
    enabled: isShowingReplies,
    retry: false,
  });

  const handleReply = () => {
    if (!user) {
      return toast.warning(
        <p className="text-base text-start">
          Login to post. The math awaits you!
        </p>
      );
    }
    setIsReplyModalOpen(true);
  };

  return (
    <>
      <div
        key={post.id}
        className={`flex flex-row gap-3 items-start border-b border-[#2f3336] px-5 py-4 ${className}`}
      >
        <div className="flex flex-col items-center gap-2 h-full">
          <div
            className={`rounded-full min-h-10 min-w-10 content-center text-center border ${getColor(
              post.userId
            )}`}
          >
            {post.user.username.slice(0, 2).toUpperCase()}
          </div>
          {isShowingReplies && (
            <div className="h-full w-px bg-muted-foreground/65"></div>
          )}
        </div>
        <div className="flex flex-col gap-1 items-start w-full h-full">
          <div className="flex flex-row items-center gap-2 text-muted-foreground text-sm">
            <p>@{post.user.username}</p>
            <div className="size-[3px] bg-muted-foreground" />
            <p>{formatTimeAgo(post.createdAt)}</p>
          </div>
          {post.op && post.rightValue !== undefined && (
            <p className="text-sm italic text-teal-500 font-medium">
              {getOperationText(post.op)} {post.rightValue}
            </p>
          )}
          <p>{post.value.toLocaleString()}</p>
          <div className="flex items-center w-full justify-between">
            <div>
              {post._count.children > 0 ? (
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => setIsShowingReplies((prevState) => !prevState)}
                >
                  {`${isShowingReplies ? "Hide" : "See"} Replies (${
                    post._count.children
                  })`}
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">No replies</p>
              )}
            </div>
            <Button
              variant="outline"
              className="flex gap-1 items-center rounded-full text-xs"
              onClick={handleReply}
            >
              <MessageCircle />
              Crunch it
            </Button>
          </div>
          {isShowingReplies && (
            <div className="flex flex-col gap-2 w-full h-full">
              {isLoading ? (
                <Spinner className="size-10 stroke-1" />
              ) : (
                <>
                  {replies?.map((reply, index) => (
                    <Post
                      key={reply.id}
                      post={reply}
                      user={user}
                      className={
                        index === replies.length - 1
                          ? "border-none pr-0"
                          : "pr-0"
                      }
                    />
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <ReplyModal
        post={post}
        user={user}
        open={isReplyModalOpen}
        onOpenChange={setIsReplyModalOpen}
      />
    </>
  );
};
