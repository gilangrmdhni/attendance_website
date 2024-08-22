import { useRouter } from 'next/router';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // Import Heroicons
import MobileContainer from '@/components/MobileContainer';
import Footer from '@/components/Footer';

const PrivacyPolicyPage = () => {
    const router = useRouter();

    return (
        <MobileContainer>
            <div className="bg-blue-800 text-white p-4 rounded-b-3xl">
                <div className='flex items-center'>
                    <button onClick={() => router.back()} className='mr-4'>
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className='text-2xl font-bold'>Privacy Policy</h1>
                </div>
            </div>
            <div className="p-4">
                <div className="bg-white p-6 rounded-lg shadow-md mb-20">
                    <h2 className="text-xl font-semibold mb-4">Introduction</h2>
                    <p className="mb-4">
                        Welcome to our Privacy Policy page. When you use our services, you trust us with your information. We are committed to protecting your privacy and ensuring your personal data is handled securely.
                    </p>

                    <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
                    <p className="mb-4">
                        We may collect personal information such as your name, email address, and phone number when you use our services. This information helps us provide you with better service and improve our offerings.
                    </p>

                    <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
                    <p className="mb-4">
                        Your information is used to personalize your experience, improve our services, and communicate with you. We may also use your information for marketing and promotional purposes, but only with your consent.
                    </p>

                    <h2 className="text-xl font-semibold mb-4">Data Security</h2>
                    <p className="mb-4">
                        We take data security seriously and use industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.
                    </p>

                    <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
                    <p className="mb-4">
                        You have the right to access, correct, or delete your personal information. If you have any concerns about your data or wish to exercise your rights, please contact us.
                    </p>

                    <h2 className="text-xl font-semibold mb-4">Changes to This Privacy Policy</h2>
                    <p className="mb-4">
                        We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our website. Please review this policy periodically for any updates.
                    </p>

                    <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
                    <p className="mb-4">
                        If you have any questions about this Privacy Policy or our practices, please contact us at privacy@example.com.
                    </p>
                </div>
            </div>
            <Footer />
        </MobileContainer>
    );
};

export default PrivacyPolicyPage;
