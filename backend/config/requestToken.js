export const getBearerToken = (req) => {
  const authorization = req.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice(7).trim() || null;
};

export const getUserRequestToken = (req) =>
  req.cookies["__Host-userTokenPartitioned"] ||
  req.cookies.userToken ||
  getBearerToken(req);
