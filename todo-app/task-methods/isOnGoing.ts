const isOnGoing = (deadline: Date) => {
  const currentTime = new Date();
  const timeDifference = deadline.getTime() - currentTime.getTime();
  if (timeDifference > 0) {
    return true;
  }
  return false;
};

export default isOnGoing;
