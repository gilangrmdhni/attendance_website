import { useRouter } from 'next/router';
import Head from 'next/head';
import Footer from '../../components/Footer';
import MobileContainer from '../../components/MobileContainer';
import DynamicFormWithHeader from '../../components/forms/DynamicForm';
import { FormConfig } from '../../store/types/formTypes';

const formConfigurations: Record<string, FormConfig> = {
    cuti: {
        title: 'Cuti Form',
        fields: [
            { type: 'date', label: 'Tanggal Mulai', name: 'start_date' },
            { type: 'date', label: 'Tanggal Selesai', name: 'end_date' },
            { type: 'textarea', label: 'Keterangan', name: 'description' }
        ],
    },
    lembur: {
        title: 'Lembur Form',
        fields: [
            { type: 'date', label: 'Tanggal', name: 'date' },
            { type: 'text', label: 'Jumlah Jam', name: 'hours' },
            { type: 'textarea', label: 'Keterangan', name: 'description' }
        ],
    },
    reimbursement: {
        title: 'Reimbursement Form',
        fields: [
            { type: 'text', label: 'Nominal', name: 'amount' },
            { type: 'text', label: 'Deskripsi', name: 'description' },
            { type: 'file', label: 'Attachment', name: 'attachment' } 
        ],
    },
    izin: {
        title: 'Izin Form',
        fields: [
            { type: 'date', label: 'Tanggal', name: 'date' },
            { type: 'textarea', label: 'Alasan', name: 'reason' }
        ],
    },
};

const RequestForm = () => {
    const router = useRouter();
    const { type } = router.query;

    const formConfig = formConfigurations[type as keyof typeof formConfigurations] || formConfigurations.cuti;

    const handleSubmit = (formData: FormData) => {
        // Handle form submission logic here
        console.log('Form data submitted:', formData);

        // You can dispatch actions or make API calls here
    };

    return (
        <MobileContainer>
            <Head>
                <title>{formConfig.title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <main className="pt-4">
                <DynamicFormWithHeader
                    title={formConfig.title}
                    fields={formConfig.fields}
                    onSubmit={handleSubmit} 
                />
            </main>
            <Footer />
        </MobileContainer>
    );
};

export default RequestForm;
