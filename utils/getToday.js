const getToday = () => {
  let options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let today = new Date().toLocaleDateString("fa-IR", options);
  console.log(today);
  return today;
};

module.exports = getToday;
