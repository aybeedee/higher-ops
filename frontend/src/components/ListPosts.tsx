import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "@/api/client";
import type { Operation, PaginationMeta, User } from "@/lib/types";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { useMemo } from "react";
import { Spinner } from "@/components/atoms";
import { Post } from "./Post";

export const ListPosts = ({ user }: { user?: User }) => {
  const {
    data,
    isFetching,
    isFetchingNextPage,
    // fetchNextPage,
    // hasNextPage
  } = useInfiniteQuery<{
    data: Operation[];
    meta: PaginationMeta;
  }>({
    queryKey: ["operations"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await apiClient.get("/operations", {
        params: { currentPage: pageParam, pageSize: DEFAULT_PAGE_SIZE },
      });
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor,
    retry: false,
  });

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data?.pages]
  );

  return isFetching && !isFetchingNextPage ? (
    <div className="flex justify-center items-center h-full">
      <Spinner className="size-20 stroke-1" />
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      {posts.map((post) => (
        <Post key={post.id} post={post} user={user} />
      ))}
    </div>
  );
};
