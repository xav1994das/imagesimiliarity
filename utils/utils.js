const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, uid"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  try {
    await fn(req, res);
  } catch (error) {
    console.error("An error occurred:", error);
    resUtil(res, 500, "An error occurred.");
    return; // Terminate the function after sending the response
  }
};

export { allowCors };
