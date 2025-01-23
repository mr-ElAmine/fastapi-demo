import axios from 'axios';

import config from '@/config';
import type { RegisterType } from '@/schema/RegisterSchema';

export async function Register(formData: RegisterType): Promise<void> {
  await axios.post(`${config.api.baseUrl}${config.api.registerEndpoint}`, {
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email,
    password: formData.password,
  });
}
