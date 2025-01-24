import axios from 'axios';

import config from '@/config';
import type { LoginType, PasswordType } from '@/schema/LoginSchema';

export async function Login(formData: LoginType): Promise<string | null> {
  const response = await axios.post(
    `${config.api.baseUrl}${config.api.loginEndpoint}`,
    {
      email: formData.email,
      password: formData.password,
    }
  );
  if (!response.data.token) {
    return null;
  }

  return response.data.token as string;
}

export async function changePassword({
  data,
}: {
  data: PasswordType;
}): Promise<void> {
  await axios.post(
    `${config.api.baseUrl}${config.api.changePasswordEndpoint}`,
    {
      old_password: data.oldPassword,
      new_password: data.newPassword,
    }
  );
}
