import { DialogMakeTransactionAuto } from '../molecules/DialogMakeTransactionAuto';
import TransfersForm from '../organisms/TransfersForm';
import MainLayout from '../templates/MainLayout';

const TransfersMoney = () => {
  return (
    <MainLayout>
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-end gap-5">
          <div>
            <DialogMakeTransactionAuto />
          </div>

          <TransfersForm />
        </div>
      </div>
    </MainLayout>
  );
};

export default TransfersMoney;
