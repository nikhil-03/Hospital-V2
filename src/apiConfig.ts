export function getApisEndPoint() {
  const BASE_URL = "http://localhost:8081";
  return {
    BASE_URL,
    LOGIN: `${BASE_URL}/login`,
    DOCTORS: `${BASE_URL}/doctors`,
    PATIENTS: `${BASE_URL}/patients`,
    APPOINTMENTS: `${BASE_URL}/appointments`,
    PRESCRIPTIONS: `${BASE_URL}/prescriptions`,
    BILLING: `${BASE_URL}/billing`,
    TESTS: `${BASE_URL}/tests`,
  };
}

export function getUserServiceAPIs() {
  const BASE_URL = "http://localhost:8082";
  return {
    BASE_URL,
    USERS_REGISTER: `${BASE_URL}/register`,
    USERS_LOGIN: `${BASE_URL}/auth/login`,
  };
}
