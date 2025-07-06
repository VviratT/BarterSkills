import { ApiResponse }  from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
  res.json(new ApiResponse({
    message: "OK",
    data:    { uptime: process.uptime() }
  }));
});

export { healthcheck };
