export const handleTokenErrors = (result: any) => {
  if (!result) {
    console.log("Token error:", result);
  } else if (result === 401) {
    console.log("Session Expired, Please log in again.");
  } else if (result === 500) {
    console.log(result);
  } else if (result instanceof Error) {
    console.log("Error message:", result.message);
  }
};
