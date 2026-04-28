import { useState } from 'react';

export type AuthMember = {
  _id: string;
  name: string;
  email: string;
  phone: string;
} | null;

export const useGlobals = () => {
  const [authMember, setAuthMember] = useState<AuthMember>(null);

  return { authMember, setAuthMember };
};
