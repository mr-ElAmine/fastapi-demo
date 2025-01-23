import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { BeneficiaryType } from '@/schema/BeneficiariesSchema';

import Card from '../atoms/Card';

const TransfersCard = ({ data }: { data: BeneficiaryType[] }) => {
  return (
    <div className="flex flex-wrap py-5">
      {data.length > 0 ? (
        data.map((beneficiary, index) => (
          <div className="w-1/3" key={index}>
            <Link to="/transactions">
              <Card>
                <div className="relative mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{beneficiary.name}</h3>
                  <ArrowRight />
                </div>
                <div className="text-sm text-gray-500">
                  <p>{beneficiary.beneficiary_account_id}</p>
                </div>
              </Card>
            </Link>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No beneficiaries available.</p>
      )}
    </div>
  );
};

export default TransfersCard;
