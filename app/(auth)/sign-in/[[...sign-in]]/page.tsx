import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#281a12",
            colorBackground: "#f6f0e1",
            fontFamily: "var(--font-sans)",
            borderRadius: "0.25rem",
          },
        }}
      />
    </div>
  );
}
