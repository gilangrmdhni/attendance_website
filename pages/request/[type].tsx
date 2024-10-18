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
            { type: 'date', label: 'Tanggal', name: 'dates' },
            { type: 'textarea', label: 'Keterangan', name: 'description' },
            { type: 'file', label: 'Tambahkan Lampiran', name: 'attachment' }
        ],
    },
    overtime: {
        title: 'Lembur Form',
        fields: [
            { type: 'date', label: 'Tanggal', name: 'dates' },
            { type: 'overtime', label: 'Jumlah Jam', name: 'overtime_hours' },
            { type: 'textarea', label: 'Keterangan', name: 'description' },
            { type: 'file', label: 'Tambahkan Lampiran', name: 'attachment' }
        ],
    },
    reimbursement: {
        title: 'Reimbursement Form',
        fields: [
            { type: 'date', label: 'Tanggal', name: 'dates' },
            { type: 'textarea', label: 'Keterangan', name: 'description' },
            { type: 'text', label: 'Dinas Perjalanan', name: 'trip' },
            { type: 'number', label: 'Nominal Pemakaian', name: 'amount' },
            { type: 'text', label: 'Rekening Penerima', name: 'account' },
            { type: 'file', label: 'Tambahkan Lampiran', name: 'attachment' }
        ],
    },
    permission: {
        title: 'Izin Form',
        fields: [
            { type: 'select', label: 'Kategori', name: 'category_permission_id' },
            { type: 'date', label: 'Tanggal', name: 'dates' },
            { type: 'textarea', label: 'Deskripsi', name: 'description' },
            { type: 'file', label: 'Tambahkan Lampiran', name: 'attachment' }
        ],
    },
};


const RequestForm = () => {
    const router = useRouter();
    const { type } = router.query;

    const formConfig = formConfigurations[type as keyof typeof formConfigurations] || formConfigurations['timeoff'];

    const handleSubmit = (formData: FormData) => {
        console.log('Form data submitted:', formData);
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
