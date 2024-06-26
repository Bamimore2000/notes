const CategoryTag = ({ handleClick, tag, current, setCurrent }) => {
  // const { handleClick, tag, current } = props;
  return (
    <div
      onClick={() => {
        handleClick(tag);
        setCurrent(tag);
      }}
    >
      <div
        style={{ backgroundColor: current === tag && "#Fff700" }}
        className="border border-black py-0.5 px-3 rounded-md text-sm border-solid"
      >
        #{tag}
      </div>
    </div>
  );
};
export default CategoryTag;
