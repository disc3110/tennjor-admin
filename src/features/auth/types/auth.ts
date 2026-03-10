export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};
