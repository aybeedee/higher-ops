import { Button } from "@/components/atoms";
import { useState } from "react";
import { LoginModal } from "./LoginModal";
import { SignupModal } from "./SignupModal";

export const AuthFooter = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState<boolean>(false);

  return (
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
        <Button
          className="rounded-full font-semibold"
          size="lg"
          onClick={() => setIsLoginModalOpen(true)}
        >
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
      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
      <SignupModal
        open={isSignupModalOpen}
        onOpenChange={setIsSignupModalOpen}
      />
    </div>
  );
};
