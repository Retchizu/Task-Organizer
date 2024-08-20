const dateFormatter = (deadline: Date): string => {
  const currentTime = new Date();
  const timeDifference = deadline.getTime() - currentTime.getTime();

  const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = monthNames[deadline.getMonth()];
  /*   const hours = deadline.getHours().toString().padStart(2, "0");
  const minutes = deadline.getMinutes().toString().padStart(2, "0"); */

  if (daysLeft < 0) {
    return `Past due`;
  } else if (daysLeft === 0 && hoursLeft > 0) {
    return `${hoursLeft} hour${hoursLeft > 1 ? "s" : ""} left`;
  } else if (daysLeft === 0 && hoursLeft === 0) {
    return "Less than an hour left";
  } else if (daysLeft === 1) {
    return `${daysLeft} day left`;
  } else if (daysLeft < 7) {
    return `${daysLeft} days left`;
  } else {
    return `${monthName} ${deadline.getDate()}, ${deadline.getFullYear()}`;
  }
};

export default dateFormatter;
