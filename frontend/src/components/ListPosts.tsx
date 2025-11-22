import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "@/api/client";
import type { Operation, PaginationMeta, User } from "@/lib/types";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { useEffect, useMemo } from "react";
import { Spinner } from "@/components/atoms";
import { Post } from "./Post";

export const ListPosts = ({ user }: { user?: User }) => {
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery<{
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

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.offsetHeight;

      if (scrollTop + windowHeight >= fullHeight - 10) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data?.pages]
  );

  return isFetching && !isFetchingNextPage ? (
    <div className="flex flex-col gap-2 justify-center items-center h-full">
      <Spinner className="size-20 stroke-1" />
      <p className="italic">Hold up, the numbers are coming in...</p>
    </div>
  ) : (
    <div className="flex flex-col gap-2 h-full">
      {posts.map((post) => (
        <Post key={post.id} post={post} user={user} />
      ))}
      {isFetchingNextPage && (
        <div className="flex flex-col gap-2 justify-center items-center py-10">
          <Spinner className="size-20 stroke-1" />
          <p className="italic">Getting you more numbers</p>
        </div>
      )}
      {posts.length > DEFAULT_PAGE_SIZE && !hasNextPage && (
        <div className="flex flex-col justify-center text-center py-10 italic">
          <p className="text-teal-500 font-semibold">Congrats,</p>
          <p>your doomscrolling just shook hands with infinity</p>
        </div>
      )}
    </div>
  );
};
