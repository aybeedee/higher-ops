import { useMemo, useState } from "react";
import { Button, Input, Spinner } from "@/components/atoms";
import { MAX_STARTING_NUMBER } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/client";
import { AuthFooter } from "@/components/AuthFooter";
import { getColor } from "@/lib/utils";

const Home = () => {
  const [startingNumber, setStartingNumber] = useState<string>();
  const [error, setError] = useState<string>("");

  const {
    data,
    isFetching: isProfileFetching,
    isSuccess: isAuthenticated,
  } = useQuery<{ id: number; username: string }>({
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

  const click = () => {
    console.log(startingNumber);
    console.log(Number(startingNumber));
  };

  const handleStartingNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(e.target.value);
    setStartingNumber(e.target.value);

    if (Number(e.target.value) > MAX_STARTING_NUMBER) {
      setError(`It's over ${MAX_STARTING_NUMBER}!`);
    } else {
      setError("");
    }
  };

  return (
    <div className="bg-black min-h-screen min-w-screen text-white flex justify-center dark">
      <div className="min-h-screen border-x border-[#2f3336] w-screen sm:w-[70vw] md:w-[60vw] lg:w-[50vw] 2xl:w-[35vw]">
        {isProfileFetching && (
          <div className="flex justify-center items-center h-full">
            <Spinner className="size-20 stroke-1" />
          </div>
        )}
        {isAuthenticated && (
          <div className="flex flex-col border-y border-[#2f3336] p-5">
            <div className="flex flex-row">
              <div
                className={`rounded-full min-h-10 content-center min-w-10 border ${getColor(
                  data?.id || 0
                )}`}
              >
                {data?.username.slice(0, 2).toUpperCase()}
              </div>
              <Input
                type="number"
                placeholder="What number is on your mind?"
                className="border-none text-lg!"
                max={MAX_STARTING_NUMBER}
                onChange={handleStartingNumberChange}
              />
            </div>
            <div className="w-full flex justify-end items-center gap-4">
              <p className="text-[0.85rem] text-red-500">{error}</p>
              <Button
                className="rounded-full font-semibold"
                onClick={click}
                disabled={!startingNumber || !!error}
                size="lg"
              >
                Post
              </Button>
            </div>
          </div>
        )}
      </div>
      {showAnonFooter && <AuthFooter />}
    </div>
  );
};

export default Home;
