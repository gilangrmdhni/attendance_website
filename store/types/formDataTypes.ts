import { useState } from "react";

interface FormData {
    description: string;
    dates: string;
    account: string;
    amount: string;
    trip: string;
    attachment: File | null;
    [key: string]: string | File | null; 
    
}

const [formData, setFormData] = useState<FormData>({
    description: '',
    dates: '',
    account: '',
    amount: '',
    trip: '',
    attachment: null,
});
