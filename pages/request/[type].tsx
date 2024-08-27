import { useRouter } from 'next/router';
import Head from 'next/head';
import Footer from '../../components/Footer';
import MobileContainer from '../../components/MobileContainer';
import DynamicFormWithHeader from '../../components/forms/DynamicForm';
import { FormConfig } from '../../store/types/formTypes';


const formConfigurations: Record<string, FormConfig> = {
    timeoff: {
        title: 'Cuti Form',
        fields: [
            { type: 'date', label: 'Pilih Tanggal', name: 'dates' },
            { type: 'textarea', label: 'Keterangan', name: 'description' },
            { type: 'file', label: 'Attachment', name: 'attachment' }
        ],
    },
    overtime: {
        title: 'Lembur Form',
        fields: [
            { type: 'date', label: 'Tanggal', name: 'dates' },
            { type: 'number', label: 'Jumlah Jam', name: 'overtime_hours' },
            { type: 'textarea', label: 'Keterangan', name: 'description' }
        ],
    },
    reimbursement: {
        title: 'Reimbursement Form',
        fields: [
            { type: 'text', label: 'Nominal', name: 'amount' },
            { type: 'textarea', label: 'Deskripsi', name: 'description' },
            { type: 'text', label: 'Account', name: 'account' },
            { type: 'text', label: 'Trip', name: 'trip' },
            { type: 'date', label: 'Dates', name: 'dates' },
            { type: 'file', label: 'Attachment', name: 'attachment' }
        ],
    },
    permission: {
        title: 'Izin Form',
        fields: [
            { type: 'text', label: 'Alasan', name: 'permission' },
            { type: 'date', label: 'Tanggal', name: 'dates' },
            { type: 'textarea', label: 'Deskripsi', name: 'description' },
            { type: 'file', label: 'Attachment', name: 'attachment' }
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
            <main>
                <div className="mb-20">
                    <DynamicFormWithHeader
                        title={formConfig.title}
                        fields={formConfig.fields}
                        onSubmit={handleSubmit}
                    />
                </div>
            </main>
            <Footer />
        </MobileContainer>
    );
};

export default RequestForm;
