import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  Spinner,
} from "@/components/atoms";
import { X } from "lucide-react";
import type { AuthFormData } from "@/lib/types";
import { useState } from "react";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/api/client";
import { isAxiosError } from "axios";
import { toast } from "sonner";

export const LoginModal = ({ open, onOpenChange }: DialogProps) => {
  const queryClient = useQueryClient();

  const [loginData, setLoginData] = useState<AuthFormData>({
    username: "",
    password: "",
  });
  const [isLoginDataValid, setIsLoginDataValid] = useState<boolean>(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: AuthFormData) => apiClient.post("/auth/login", data),
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data.message
        : error.message;

      toast.error(
        <p className="text-base text-start">{`Login failed. ${
          message || "Please try again"
        }`}</p>
      );
    },
    onSuccess: (res) => {
      localStorage.setItem("accessToken", res.data.accessToken);
      toast.success(
        <p className="text-base text-start">Login successful! Welcome back</p>
      );
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      onOpenChange?.(false);
    },
  });

  const handleLoginDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => {
      const updated = { ...prev, [e.target.name]: e.target.value };
      checkLoginDataValidity(updated);
      return { ...updated };
    });
  };

  const checkLoginDataValidity = ({ username, password }: AuthFormData) => {
    if (!username.length || !password.length) {
      setIsLoginDataValid(false);
      return;
    }

    setIsLoginDataValid(true);
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
              Log In
            </DialogTitle>
            <DialogDescription className="text-base font-light text-center">
              Ready for operation?
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
                  onChange={handleLoginDataChange}
                />
                <InputGroupAddon align="inline-start">
                  <InputGroupText>@</InputGroupText>
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
                  onChange={handleLoginDataChange}
                />
              </InputGroup>
            </div>
            <Button
              variant="secondary"
              className="rounded-full font-semibold mt-2"
              size="lg"
              disabled={!isLoginDataValid || isPending}
              onClick={() => mutate(loginData)}
            >
              {isPending && <Spinner />}
              Log in
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
