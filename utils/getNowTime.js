const getNowTime = () => {
  let options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  let now = new Date().toLocaleDateString("fa-IR", options);
  console.log(now);
  return now;
};

module.exports = getNowTime;
