import axios from 'axios';

import config from '@/config';
import type { BeneficiaryType } from '@/schema/BeneficiariesSchema';
import { BeneficiariesTableSchema } from '@/schema/BeneficiariesSchema';

export async function MyBeneficiaries(): Promise<BeneficiaryType[]> {
  try {
    const response = await axios.get(
      `${config.api.baseUrl}${config.api.myBeneficiariesEndpoint}`
    );

    const data = response.data;

    return BeneficiariesTableSchema.parse(data);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function OtherBeneficiaries(): Promise<BeneficiaryType[]> {
  try {
    const response = await axios.get(
      `${config.api.baseUrl}${config.api.otherBeneficiariesEndpoint}`
    );

    const data = response.data;

    return BeneficiariesTableSchema.parse(data);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function AddBeneficiaries({
  data,
}: {
  data: { name: string; beneficiary_account_id: string };
}) {
  return axios.post(
    `${config.api.baseUrl}${config.api.addBeneficiariesEndpoint}`,
    {
      ...data,
    }
  );
}
