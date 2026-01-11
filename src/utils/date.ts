import { format } from "date-fns";
const monthThai = {
  "01": "มกราคม",
  "02": "กุมภาพันธ์",
  "03": "มีนาคม",
  "04": "เมษายน",
  "05": "พฤษภาคม",
  "06": "มิถุนายน",
  "07": "กรกฎาคม",
  "08": "สิงหาคม",
  "09": "กันยายน",
  "10": "ตุลาคม",
  "11": "พฤศจิกายน",
  "12": "ธันวาคม",
};

export const transformDateThai = (inputDate: Date) => {
  const day = format(inputDate, "dd");
  const month = monthThai[format(inputDate, "MM") ?? "01"];
  const year = String(parseInt(format(inputDate, "yyyy")) + 543);

  return `${day}/${month}/${year}`;
};

monthThai["01"];
