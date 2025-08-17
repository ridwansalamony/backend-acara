export type TRegister = {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type TLogin = {
  identifier: string;
  password: string;
};
