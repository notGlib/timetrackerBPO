"use client";

import { useState, useEffect } from "react";
import { ProjectLocation } from "@prisma/client";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface ProjectFormData {
  name: string;
  clientId: string;
  address: string;
  location: ProjectLocation;
  budget: number;
  manager: string;
}

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: ProjectFormData;
  isEditMode?: boolean;
}

export default function ProjectForm({
  onSubmit,
  onCancel,
  initialData,
  isEditMode = false,
}: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>(
    initialData || {
      name: "",
      clientId: "",
      address: "",
      location: "INSIDE" as ProjectLocation,
      budget: 0,
      manager: "",
    }
  );

  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/clients");
        if (response.ok) {
          const clientsData = await response.json();
          setClients(clientsData);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setIsLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Όνομα Project
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
          htmlFor="clientId"
          className="block text-sm font-medium text-gray-700"
        >
          Πελάτης
        </label>
        <select
          id="clientId"
          required
          disabled={isLoadingClients}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
          value={formData.clientId}
          onChange={(e) =>
            setFormData({ ...formData, clientId: e.target.value })
          }
        >
          <option value="">
            {isLoadingClients ? "Φόρτωση πελατών..." : "Επιλέξτε πελάτη"}
          </option>
          {clients.map((client) => (
            <option key={client.id} value={client.id.toString()}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Διεύθυνση
        </label>
        <input
          type="text"
          id="address"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Τοποθεσία
        </label>
        <select
          id="location"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none"
          value={formData.location}
          onChange={(e) =>
            setFormData({
              ...formData,
              location: e.target.value as ProjectLocation,
            })
          }
        >
          <option value="INSIDE">ΕΝΤΟΣ</option>
          <option value="OUTSIDE">ΕΚΤΟΣ</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="budget"
          className="block text-sm font-medium text-gray-700"
        >
          Budget
        </label>
        <input
          type="number"
          id="budget"
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none"
          value={formData.budget}
          onChange={(e) =>
            setFormData({ ...formData, budget: parseFloat(e.target.value) })
          }
        />
      </div>

      <div>
        <label
          htmlFor="manager"
          className="block text-sm font-medium text-gray-700"
        >
          Υπεύθυνος
        </label>
        <input
          type="text"
          id="manager"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none"
          value={formData.manager}
          onChange={(e) =>
            setFormData({ ...formData, manager: e.target.value })
          }
        />
      </div>

      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="submit"
          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
        >
          {isEditMode ? "Ενημέρωση" : "Δημιουργία"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
        >
          Ακύρωση
        </button>
      </div>
    </form>
  );
}
