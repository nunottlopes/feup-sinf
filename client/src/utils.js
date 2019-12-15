export function nFormatter(num, digits) {
  var si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "k" },
    { value: 1E6, symbol: "M" },
    { value: 1E9, symbol: "G" },
    { value: 1E12, symbol: "T" },
    { value: 1E15, symbol: "P" },
    { value: 1E18, symbol: "E" }
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

export function euroCurrency(number) {
  return new Intl.NumberFormat('pt-PT', { 
    style: 'currency', 
    currency: 'EUR'
  }).format(number);
}

export function formatDate(date) {
  let date_obj = new Date(date);
  const options = { year: 'numeric', month: 'long', day: '2-digit' };
  return date_obj.toLocaleDateString("pt-PT", options);
}