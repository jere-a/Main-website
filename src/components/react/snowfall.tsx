import Snowfall from "react-snowfall";

const snow = () => {
  return (
    <div
      style={{
        height: 400,
        width: 400,
        background: "#282c34",
        position: "relative",
      }}
    >
      <Snowfall />
    </div>
  );
};

export default snow;
