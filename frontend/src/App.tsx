import { useState } from "react";
import "./App.css";
import { Button, Input } from "./components/atoms";
import { MAX_STARTING_NUMBER } from "./lib/constants";

function App() {
  const [startingNumber, setStartingNumber] = useState<string>();
  const [error, setError] = useState<string>("");

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
        <div className="flex flex-col border-y border-[#2f3336] p-5">
          <div className="flex flex-row">
            <div className="rounded-full bg-gray-800 p-2 border border-gray-700">
              AU
            </div>
            <Input
              type="number"
              placeholder="What number is on your mind?"
              className="border-none"
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
            >
              Post
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full fixed bottom-0 bg-teal-500 flex flex-col sm:flex-row justify-between items-center px-[1vw] md:px-[7.5vw] lg:px-[10vw] xl:px-[20vw] py-3 gap-4 sm:gap-8">
        <div className="flex flex-col text-left">
          <h2 className="text-lg sm:text-xl xl:text-2xl font-bold whitespace-nowrap">
            Don't miss what's being calculated
          </h2>
          <p className="text-sm xl:text-base font-medium whitespace-nowrap">
            Things on Higher Ops add up very quickly.
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button className="rounded-full font-semibold" size="lg">
            Log in
          </Button>
          <Button
            variant="secondary"
            className="rounded-full font-semibold"
            size="lg"
          >
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
