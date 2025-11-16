import { useState } from "react";
import "./App.css";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/atoms";
import { MAX_STARTING_NUMBER } from "@/lib/constants";
import { InfoIcon } from "lucide-react";

function App() {
  const [startingNumber, setStartingNumber] = useState<string>();
  const [error, setError] = useState<string>("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState<boolean>(false);

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
            onClick={() => setIsSignupModalOpen(true)}
          >
            Sign up
          </Button>
        </div>
      </div>
      <Dialog open={isSignupModalOpen} onOpenChange={setIsSignupModalOpen}>
        <DialogContent
          showCloseButton={false}
          className="bg-black border border-[#2f3336] shadow-2xl"
        >
          <div className="flex flex-col gap-8 text-white pb-5 px-5">
            <div className="flex flex-col gap-4">
              <DialogTitle className="text-2xl font-extrabold text-center">
                Sign Up
              </DialogTitle>
              <DialogDescription className="text-base font-light text-center">
                Register to join the arithmetic
              </DialogDescription>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <p className="font-semibold">Username</p>
                <InputGroup className="border border-[#2f3336]">
                  <InputGroupInput
                    placeholder="aybeedee"
                    type="text"
                    className="text-base!"
                  />
                  <InputGroupAddon align="inline-start">
                    <InputGroupText>@</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <Tooltip>
                      <TooltipTrigger
                        asChild
                        className="hover:bg-white/10 hover:text-white"
                      >
                        <InputGroupButton
                          variant="ghost"
                          aria-label="Info"
                          size="icon-xs"
                        >
                          <InfoIcon className="size-5" />
                        </InputGroupButton>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-center text-sm">
                          <span>
                            Username must be between 6 to 20 characters with no
                          </span>
                          <br />
                          <span>special characters except underscore</span>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-semibold">Password</p>
                <InputGroup className="border border-[#2f3336]">
                  <InputGroupInput
                    placeholder="Enter password"
                    type="password"
                    className="text-base!"
                  />
                  <InputGroupAddon align="inline-end">
                    <Tooltip>
                      <TooltipTrigger
                        asChild
                        className="hover:bg-white/10 hover:text-white"
                      >
                        <InputGroupButton
                          variant="ghost"
                          aria-label="Info"
                          size="icon-xs"
                        >
                          <InfoIcon className="size-5" />
                        </InputGroupButton>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">
                          Password must be between 8 to 16 characters
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <Button
                variant="secondary"
                className="rounded-full font-semibold mt-2"
                size="lg"
              >
                Sign up
              </Button>
            </div>
          </div>

          {/* <Input type="text" />
          <Input type="password" /> */}

          {/* <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose> */}

          {/* <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
