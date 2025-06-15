"use client";

import { useState } from "react";

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
}

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: ClientFormData;
  isEditMode?: boolean;
}

export default function ClientForm({
  onSubmit,
  onCancel,
  initialData,
  isEditMode = false,
}: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>(
    initialData || {
      name: "",
      email: "",
      phone: "",
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
      // Form will be closed by the parent component after successful submission
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while saving the client"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Όνομα Πελάτη
        </label>
        <input
          type="text"
          id="name"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Τηλέφωνο
        </label>
        <input
          type="tel"
          id="phone"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300 sm:col-start-2"
        >
          {isSubmitting
            ? isEditMode
              ? "Ενημέρωση..."
              : "Αποθήκευση..."
            : isEditMode
            ? "Ενημέρωση"
            : "Αποθήκευση"}
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onCancel}
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:bg-gray-100 sm:col-start-1 sm:mt-0"
        >
          Ακύρωση
        </button>
      </div>
    </form>
  );
}
