import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { MyBeneficiaries, OtherBeneficiaries } from '@/api/Beneficiaries';
import { makeTransaction } from '@/api/Transaction';
import type { BeneficiaryType } from '@/schema/BeneficiariesSchema';
import { TransactionCreateSchema } from '@/schema/TransactionSchema';

import { Button } from '../atoms/Button';
import Input from '../atoms/Input';
import { CustomSelect } from '../atoms/Select';

const TransfersForm = () => {
  const navigate = useNavigate();

  const [myBeneficiaries, setMyBeneficiaries] = useState<BeneficiaryType[]>([]);
  const [otherBeneficiaries, setOtherBeneficiaries] = useState<
    BeneficiaryType[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMyBeneficiary, setSelectedMyBeneficiary] = useState<
    string | undefined
  >();
  const [selectedOtherBeneficiary, setSelectedOtherBeneficiary] = useState<
    string | undefined
  >();
  const [formData, setFormData] = useState({
    amount: '',
    label: '',
  });
  const [formMessage, setFormMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const myData = await MyBeneficiaries();
        const otherData = await OtherBeneficiaries();

        setMyBeneficiaries(myData);
        setOtherBeneficiaries(otherData);
      } catch (error) {
        console.error(error);
        setFormMessage('Erreur lors du chargement des bénéficiaires.');
      } finally {
        setLoading(false);
      }
    };

    void fetchBeneficiaries();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // Vérifiez que tous les champs obligatoires sont remplis
    if (
      !formData.amount ||
      !selectedMyBeneficiary ||
      !selectedOtherBeneficiary
    ) {
      setFormMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Construction des données à valider
    const transactionData = {
      amount: parseFloat(formData.amount), // Convertir en nombre
      id_account_sender: selectedMyBeneficiary,
      id_account_receiver: selectedOtherBeneficiary,
      label: formData.label || '', // Le label est facultatif
    };

    // Validation avec Zod
    const parsedData = TransactionCreateSchema.safeParse(transactionData);

    if (!parsedData.success) {
      setFormMessage('Validation échouée. Vérifiez vos données.');
      console.error('Validation errors:', parsedData.error.format());
      return;
    }

    // Réinitialisez le message en cas de succès
    setFormMessage(null);

    try {
      await makeTransaction({ data: parsedData.data });
      setFormMessage('Transaction effectuée avec succès.');
      void navigate('/transfers');
    } catch (error) {
      console.error('Erreur lors de la transaction :', error);
      setFormMessage('Erreur lors de la soumission. Veuillez réessayer.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl text-gray-500">Chargement des données...</p>
      </div>
    );
  }

  // Helper pour mapper les bénéficiaires vers des options de dropdown
  const mapToOptions = (beneficiaries: BeneficiaryType[]) =>
    beneficiaries.map((b) => ({
      value: b.beneficiary_account_id,
      label: (
        <div className="flex flex-col items-start justify-start">
          <h3 className="text-lg font-semibold">{b.name}</h3>
          <span className="mt-2 block text-sm hover:text-gray-50">
            {b.beneficiary_account_id}
          </span>
        </div>
      ),
    }));

  const myBeneficiaryOptions = mapToOptions(myBeneficiaries);
  const otherBeneficiaryOptions = mapToOptions(otherBeneficiaries);

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Transfers Form</h1>
      {formMessage && (
        <p className="mt-4 text-sm text-red-600">{formMessage}</p>
      )}
      <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex items-center gap-4">
          <CustomSelect
            label=""
            options={myBeneficiaryOptions}
            placeholder="Select from My Beneficiaries"
            value={selectedMyBeneficiary}
            onChange={(value) => setSelectedMyBeneficiary(value)}
            className="mb-4"
          />
          <ArrowRight size={50} />
          <CustomSelect
            label=""
            options={[...myBeneficiaryOptions, ...otherBeneficiaryOptions]}
            placeholder="Select from Other Beneficiaries"
            value={selectedOtherBeneficiary}
            onChange={(value) => setSelectedOtherBeneficiary(value)}
            className="mb-4"
          />
        </div>
        <Input
          id="amount"
          type="number"
          label="Montant"
          placeholder="Entrez le montant"
          value={formData.amount}
          onChange={handleChange}
          message={formMessage && !formData.amount ? formMessage : ''}
          messageType="error"
          className="mb-4"
        />

        <Input
          id="label"
          type="text"
          label="Libellé"
          placeholder="Entrez le libellé"
          value={formData.label}
          onChange={handleChange}
          className="mb-4"
        />

        <Button type="submit" variant="outline">
          Confirmer
        </Button>
      </form>
    </div>
  );
};

export default TransfersForm;
