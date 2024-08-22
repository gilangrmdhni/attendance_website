import { useRouter } from 'next/router';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import MobileContainer from '@/components/MobileContainer';
import Footer from '@/components/Footer';

const TermsConditionsPage = () => {
    const router = useRouter();

    return (
        <MobileContainer>
            <div className="bg-blue-800 text-white p-4 rounded-b-3xl">
                <div className='flex items-center'>
                    <button onClick={() => router.back()} className='mr-4'>
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className='text-2xl font-bold'>Terms & Conditions</h1>
                </div>
            </div>
            <div className="p-4 ">
                <div className="bg-white p-6 rounded-lg shadow-md mb-20">
                    <h2 className="text-xl font-semibold mb-4">Introduction</h2>
                    <p className="mb-4">
                        Welcome to our Terms & Conditions page. These terms govern your use of our services and products. By accessing or using our services, you agree to be bound by these terms and conditions.
                    </p>

                    <h2 className="text-xl font-semibold mb-4">Acceptance of Terms</h2>
                    <p className="mb-4">
                        By using our services, you agree to comply with and be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use our services.
                    </p>

                    <h2 className="text-xl font-semibold mb-4">User Responsibilities</h2>
                    <p className="mb-4">
                        You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
                    </p>

                    <h2 className="text-xl font-semibold mb-4">Prohibited Activities</h2>
                    <p className="mb-4">
                        You agree not to engage in any activities that are illegal or prohibited by these terms, including but not limited to, attempting to gain unauthorized access to our systems or networks, using our services for malicious purposes, or infringing upon the rights of others.
                    </p>

                    <h2 className="text-xl font-semibold mb-4">Limitation of Liability</h2>
                    <p className="mb-4">
                        Our liability to you for any damages arising out of or related to your use of our services is limited to the maximum extent permitted by law. We are not liable for any indirect, incidental, special, or consequential damages.
                    </p>

                    <h2 className="text-xl font-semibold mb-4">Changes to Terms</h2>
                    <p className="mb-4">
                        We may update these Terms & Conditions from time to time. We will notify you of any significant changes by posting the new terms on our website. Please review these terms periodically to stay informed of any updates.
                    </p>

                    <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
                    <p className="mb-4">
                        If you have any questions about these Terms & Conditions, please contact us at support@example.com.
                    </p>
                </div>
            </div>
            <Footer />
        </MobileContainer>
    );
};

export default TermsConditionsPage;
