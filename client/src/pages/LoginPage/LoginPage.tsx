import { Link } from "react-router";

function LoginPage() {
  return (
    <div className="w-full h-[80vh] flex justify-center items-center">
      <div className="flex flex-col gap-6 w-84">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Welcome back</h1>
          <p className="text-zinc-500 text-sm">
            Sign in to your account to continue
          </p>
        </div>
        <button className="border bg-zinc-950 border-zinc-800 rounded-md h-10 text-sm cursor-pointer flex gap-2 items-center justify-center transition duration-300 hover:-translate-y-0.5 hover:border-zinc-600">
          {/* Google Icon */}
          <svg viewBox="0 0 533.5 544.3" className="w-4 h-4">
            <path
              fill="#4285F4"
              d="M533.5 278.4c0-17.4-1.6-34-4.6-50.1H272v95h146.9c-6.3 34-25 62.8-53.3 82.1v68h86.1c50.4-46.5 81.8-115 81.8-195z"
            />
            <path
              fill="#34A853"
              d="M272 544.3c72.6 0 133.6-24.1 178.1-65.3l-86.1-68c-24 16.1-54.8 25.6-92 25.6-70.7 0-130.6-47.7-152-111.7h-89.6v70.2C74.5 482.4 166.3 544.3 272 544.3z"
            />
            <path
              fill="#FBBC05"
              d="M120 324.9c-10.4-30.9-10.4-64.1 0-95l-89.6-70.2C7.5 202.1 0 236.4 0 272s7.5 69.9 30.4 112.3l89.6-70.2z"
            />
            <path
              fill="#EA4335"
              d="M272 107.7c39.5 0 75 13.6 103 40.3l77.2-77.2C405.6 24.1 344.6 0 272 0 166.3 0 74.5 61.9 30.4 159.7l89.6 70.2C141.4 155.4 201.3 107.7 272 107.7z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
        <div className="flex justify-between gap-1 text-sm items-center">
          <span className="border grow h-0 border-zinc-800"></span>
          <span className="text-zinc-500">or</span>
          <span className="border grow h-0 border-zinc-800"></span>
        </div>
        <form className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.25">
            <label className="text-zinc-400 text-xs">Email address</label>
            <input
              type="email"
              className="w-full border rounded-md border-zinc-800 bg-neutral-900 h-10 px-3 text-sm placeholder:text-neutral-600 outline-0 focus:border-yellow-600 transition duration-200 text-zinc-400"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col gap-1.25">
            <label className="text-zinc-400 text-xs">Password</label>
            <input
              type="password"
              className="w-full border rounded-md border-zinc-800 bg-neutral-900 h-10 px-3 text-sm placeholder:text-neutral-600 outline-0 focus:border-yellow-600 transition duration-200 text-zinc-400"
              placeholder="***********"
            />
          </div>
          <button className="bg-yellow-500 text-black font-semibold text-sm rounded-md grow transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-400 w-full p-2 mt-2 cursor-pointer">
            Sign in
          </button>
        </form>
        <p className="text-center text-sm text-zinc-500 tracking-tight">
          Don't have an account?{" "}
          <Link to={"/register"} className="text-yellow-500 cursor-pointer">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
