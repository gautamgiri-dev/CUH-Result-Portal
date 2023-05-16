export const BASE_URL = new URL("http://127.0.0.1:5000/");

export function getEndpoint(relative) {
  return new URL("api/v1/" + relative, BASE_URL).href;
}

export const REGISTER_API = "http://127.0.0.1:5000/api/v1/users/register";
export const LOGIN_API = "http://127.0.0.1:5000/api/v1/users/login";
export const PORTALDATA = "meta/get-metadata";
export const RESULTAPI = "students/get-result";
export const SITEMAP = "sitemap";
export const ALLUSERADMIN = getEndpoint("users/get-all");
