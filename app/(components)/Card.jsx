import Link from "next/link";
const Card = ({ category, title, body, createdAt, _id }) => {
  return (
    <Link href={`/individualnote/${_id}`}>
      <div className="wrapper card-showcase cursor-pointer bg-[#FFC107] border-black border border-solid card rounded-[20px] inline-block  w-[170px] h-[220px] md:w-auto md:h-auto p-3 max-w-[220px]">
        <h5 className="font-semibold mb-[-9px] md:font-bold md:text-[20px]">
          {title}
        </h5>
        <span className="text-[10px] text-gray-900 -mt-6 md:text-[14px]">
          4th Jan 2050
        </span>
        <p className="desc mt-2 text-[10px] text-gray-900 md:text-[20px]">
          {body.slice(0, 80)}...
        </p>
      </div>
    </Link>
  );
};
export default Card;
