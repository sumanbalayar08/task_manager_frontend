export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
}

export type RegisterResponse = {
  success: boolean;
  message: string;
}

export type LoginRequest = {
  email: string;
  password: string;
}

export type LoginResponse = {
  success: boolean;
  message: string;
}

export type AuthResponse = {
  success: boolean;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}