import React from "react";


export default function ForgotPassword () {
    return(
      <form action="">

       <div className="mb-6 font-semibold">
          Email:
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full h-9 border border-black rounded-md px-3 text-base text-black/80 outline-none focus:ring-1 focus:ring-black mt-1"
          />
        </div>


        <button className="w-full h-12 bg-black text-white rounded-md text-base font-medium hover:bg-black/90 transition-colors">
          SEND RESET LINK
        </button>

      </form>
    )
}