import { X } from "lucide-react";
import Link from "next/link";

function Hands() {
  return (
    <div>
      <Link className="float-end m-3 rounded-full border border-white p-1" href="/">
        <X className="size-5" />
      </Link>
      <img alt="poker hand rankings" src="./poker-hand-rankings.jpg" />
    </div>
  );
}

// eslint-disable-next-line import/no-unused-modules
export default Hands;
