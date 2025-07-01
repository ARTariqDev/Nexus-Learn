import Link from "next/link";

const Resources = (props) => {
  const link = '/home/' + props.link;

  return (
    <div className="group bg-[#111111] border-2 border-[#6c6c6c] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-[15rem] w-[20rem] transform hover:scale-105 hover:shadow-2xl">
        <h2 className="text-5xl text-[#ffaa00] text-center font-[Monoton] mb-4 break-words leading-snug mt-4 group-hover:animate-glow transition-all duration-300">
            {props.head}
        </h2>
        <Link href={link}>
            <button className="mt-auto bg-[#ffaa00] text-black font-semibold px-6 py-2 rounded-xl hover:bg-transparent hover:text-[#ffaa00] hover:border-2 hover:border-[#ffaa00] transition-all w-full">
            View Resources →
            </button>
        </Link>
    </div>

  );
};

export default Resources;
