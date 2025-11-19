import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/atoms";
import { InfoIcon, X } from "lucide-react";
import type { AuthFormData } from "@/lib/types";
import { useState } from "react";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "@/api/client";
import { isAxiosError } from "axios";

export const SignupModal = ({ open, onOpenChange }: DialogProps) => {
  const queryClient = useQueryClient();
  const [signupData, setSignupData] = useState<AuthFormData>({
    username: "",
    password: "",
  });
  const [isSignupDataValid, setIsSignupDataValid] = useState<boolean>(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: AuthFormData) => apiClient.post("/auth/signup", data),
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(
        <p className="text-base text-start">{`Signup failed. ${
          message || "Please try again"
        }`}</p>
      );
    },
    onSuccess: (res) => {
      localStorage.setItem("accessToken", res.data.accessToken);
      toast.success(
        <p className="text-base text-start">
          Signup successful! Welcome to Higher Ops
        </p>
      );
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      onOpenChange?.(false);
    },
  });

  const handleSignupDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData((prev) => {
      const updated = { ...prev, [e.target.name]: e.target.value };
      checkSignupDataValidity(updated);
      return { ...updated };
    });
  };

  const checkSignupDataValidity = ({ username, password }: AuthFormData) => {
    const usernameValid =
      username.length >= 6 &&
      username.length <= 20 &&
      /^[a-zA-Z0-9_]+$/.test(username);
    const passwordValid = password.length >= 8 && password.length <= 16;

    if (!usernameValid || !passwordValid) {
      setIsSignupDataValid(false);
      return;
    }

    setIsSignupDataValid(true);
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
            className="bg-transparent absolute top-4 right-4 border-none rounded-full"
          >
            <Button variant="outline" size="icon">
              <X />
            </Button>
          </DialogClose>
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
                  name="username"
                  onChange={handleSignupDataChange}
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
                  name="password"
                  onChange={handleSignupDataChange}
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
              disabled={!isSignupDataValid || isPending}
              onClick={() => mutate(signupData)}
            >
              {isPending && <Spinner />}
              Sign up
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
