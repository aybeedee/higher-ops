import { Button } from "@/components/atoms";
import { useState } from "react";
import { formatTimeAgo, getColor } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import type { Operation, User } from "@/lib/types";
import { ReplyModal } from "./ReplyModal";
import { toast } from "sonner";

export const Post = ({ post, user }: { post: Operation; user?: User }) => {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState<boolean>(false);

  const handleReply = () => {
    if (!user) {
      return toast.warning(
        <p className="text-base text-start">Log in to reply.</p>
      );
    }
    setIsReplyModalOpen(true);
  };

  return (
    <>
      <div
        key={post.id}
        className="flex flex-row gap-3 items-start border-b border-[#2f3336] px-5 py-4"
      >
        <div
          className={`rounded-full min-h-10 content-center min-w-10 border ${getColor(
            post.userId
          )}`}
        >
          {post.user.username.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex flex-col gap-1 items-start w-full">
          <div className="flex flex-row items-center gap-2 text-muted-foreground text-sm">
            <p>@{post.user.username}</p>
            <div className="size-[3px] bg-muted-foreground" />
            <p>{formatTimeAgo(post.createdAt)}</p>
          </div>
          <p>{post.value}</p>
          <div className="flex items-center w-full justify-between">
            <div>
              {post._count.children > 0 ? (
                <Button variant="link" className="p-0">
                  See Replies ({post._count.children})
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
