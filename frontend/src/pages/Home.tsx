import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/client";
import { AuthFooter } from "@/components/AuthFooter";
import type { User } from "@/lib/types";
import { CreatePost } from "@/components/CreatePost";
import { ListPosts } from "@/components/ListPosts";

const Home = () => {
  const {
    data: user,
    isFetching: isProfileFetching,
    isSuccess: isAuthenticated,
  } = useQuery<User>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await apiClient.get("/auth/profile");
      return res.data;
    },
    retry: false,
  });

  const showAnonFooter = useMemo(
    () => !isProfileFetching && !isAuthenticated,
    [isAuthenticated, isProfileFetching]
  );

  return (
    <div className="bg-black text-white flex justify-center dark">
      <div className="min-h-screen border-x border-[#2f3336] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] 2xl:w-[35vw] overflow-hidden">
        {isAuthenticated && <CreatePost user={user} />}
        <ListPosts user={user} />
      </div>
      {showAnonFooter && <AuthFooter />}
    </div>
  );
};

export default Home;
