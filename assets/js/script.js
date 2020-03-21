console.log(`hy ${rows[0].name}`);
const selectedOption = document.getElementsByClassName(`${rows.nation}`);
const init = () => {
  selectedOption.setAttribute("selected", "selected");
};
if (selectedOption) init();
