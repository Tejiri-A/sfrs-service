import { Button } from "./ui/button.tsx";

import { useSignOut } from "../hooks/useSignOut.ts";

const Navbar = () => {
  const { mutate: signOut, isPending } = useSignOut();

  return (
    <header
      className={`sticky top-0 left-0 z-50 w-full border-b bg-background/95 `}
    >
      <div
        className={`container mx-auto my-0 flex h-14 items-center justify-between`}
      >
        <div className={`flex items-center gap-2`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          <span className={`font-bold`}>SFRS Service Request</span>
        </div>
        <Button variant={`outline`} size={`sm`} onClick={signOut}>
          {isPending ? "Signing out" : "Sign out"}
        </Button>
      </div>
    </header>
  );
};
export default Navbar;
