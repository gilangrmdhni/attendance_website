// formTypes.ts
export type FieldType = 'text'| 'number' | 'email' | 'password' | 'textarea' | 'date' | 'file';

export interface Field {
    type: FieldType;
    label: string;
    name: string;
}

export interface FormConfig {
    title: string;
    fields: Field[];
}
