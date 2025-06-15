"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import ProjectForm from "@/components/ProjectForm";
import ClientForm from "@/components/ClientForm";

type ShiftType = "B" | "BT" | "A" | "-";

interface EmployeeSchedule {
  employeeName: string;
  shifts: ShiftType[];
}

interface WeeklyCapacity {
  totalHours: number;
  capacity: number;
  budget: number;
}

interface ProjectSchedule {
  projectId: string;
  clientName: string;
  projectName: string;
  regularHours: number;
  overtimeHours: number;
  ratePerHour: number;
  location: string;
  supervisor: string;
  budget: number;
  employees: EmployeeSchedule[];
  weeklySummary: WeeklyCapacity[];
}

interface ClientFromDB {
  id: number;
  name: string;
  email: string;
  phone: string;
  projects: Project[];
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: number;
  name: string;
  address: string;
  location: string;
  budget: number;
  manager: string;
  clientId: number;
}

export default function SchedulePage() {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientFromDB | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const weeks = [
    "M 03",
    "T 04",
    "W 05",
    "T 06",
    "F 07",
    "S 08",
    "S 09",
    "M 10",
    "T 11",
    "W 12",
    "T 13",
    "F 14",
    "S 15",
    "S 16",
  ];

  const [projectSchedule, setProjectSchedule] = useState<ProjectSchedule>({
    projectId: "22",
    clientName: "DIXONS",
    projectName: "Εξυπηρέτηση Πελατών",
    regularHours: 64,
    overtimeHours: 56,
    ratePerHour: 19.95,
    location: "Ανδρομέδα 63 Τώρης, 177 78",
    supervisor: "ΠΙΣΤΙΚΟΣ ΑΝΤ. ΜΙΧΑΛΗΣ",
    budget: 2400,
    employees: [
      {
        employeeName: "ROZENBERG CHRISTINA",
        shifts: Array(14).fill("B"),
      },
      {
        employeeName: "ΑΛΑΤΕΡΟΥ ΖΑΦΕΙΡΙΑ",
        shifts: [
          "B",
          "B",
          "B",
          "BT",
          "B",
          "-",
          "B",
          "B",
          "B",
          "BT",
          "B",
          "-",
          "B",
          "B",
        ],
      },
      // Add more employees as needed
    ],
    weeklySummary: [{ totalHours: 64, capacity: 2.0, budget: 2400 }],
  });

  const [clients, setClients] = useState<ClientFromDB[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);

  // Fetch clients from API
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

  // Refresh clients when new client is added
  const refreshClients = async () => {
    try {
      const response = await fetch("/api/clients");
      if (response.ok) {
        const clientsData = await response.json();
        setClients(clientsData);
      }
    } catch (error) {
      console.error("Error refreshing clients:", error);
    }
  };

  // Handle client edit
  const handleEditClient = (client: ClientFromDB) => {
    setEditingClient(client);
    setIsEditClientModalOpen(true);
  };

  // Handle project edit
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsEditProjectModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Project Creation Modal */}
      <Modal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        title="Νέο Project"
      >
        <ProjectForm
          onSubmit={async (data) => {
            try {
              const response = await fetch("/api/projects", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              });

              if (!response.ok) {
                throw new Error("Failed to create project");
              }

              setIsNewProjectModalOpen(false);
              refreshClients(); // Refresh to show new project under client
            } catch (error) {
              console.error("Error creating project:", error);
              alert("Failed to create project. Please try again.");
            }
          }}
          onCancel={() => setIsNewProjectModalOpen(false)}
        />
      </Modal>

      {/* Client Creation Modal */}
      <Modal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        title="Νέος Πελάτης"
      >
        <ClientForm
          onSubmit={async (data) => {
            try {
              const response = await fetch("/api/clients", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              });

              if (!response.ok) {
                throw new Error("Failed to create client");
              }

              setIsNewClientModalOpen(false);
              alert("Client created successfully!");
              refreshClients();
            } catch (error) {
              console.error("Error creating client:", error);
              alert("Failed to create client. Please try again.");
            }
          }}
          onCancel={() => setIsNewClientModalOpen(false)}
        />
      </Modal>

      {/* Edit Client Modal */}
      <Modal
        isOpen={isEditClientModalOpen}
        onClose={() => {
          setIsEditClientModalOpen(false);
          setEditingClient(null);
        }}
        title="Επεξεργασία Πελάτη"
      >
        <ClientForm
          onSubmit={async (data) => {
            try {
              const response = await fetch(
                `/api/clients/${editingClient?.id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                }
              );

              if (!response.ok) {
                throw new Error("Failed to update client");
              }

              setIsEditClientModalOpen(false);
              setEditingClient(null);
              alert("Client updated successfully!");
              refreshClients();
            } catch (error) {
              console.error("Error updating client:", error);
              alert("Failed to update client. Please try again.");
            }
          }}
          onCancel={() => {
            setIsEditClientModalOpen(false);
            setEditingClient(null);
          }}
          initialData={
            editingClient
              ? {
                  name: editingClient.name,
                  email: editingClient.email,
                  phone: editingClient.phone,
                }
              : undefined
          }
          isEditMode={true}
        />
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={isEditProjectModalOpen}
        onClose={() => {
          setIsEditProjectModalOpen(false);
          setEditingProject(null);
        }}
        title="Επεξεργασία Project"
      >
        <ProjectForm
          onSubmit={async (data) => {
            try {
              const response = await fetch(
                `/api/projects/${editingProject?.id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                }
              );

              if (!response.ok) {
                throw new Error("Failed to update project");
              }

              setIsEditProjectModalOpen(false);
              setEditingProject(null);
              alert("Project updated successfully!");
              refreshClients();
            } catch (error) {
              console.error("Error updating project:", error);
              alert("Failed to update project. Please try again.");
            }
          }}
          onCancel={() => {
            setIsEditProjectModalOpen(false);
            setEditingProject(null);
          }}
          initialData={
            editingProject
              ? {
                  name: editingProject.name,
                  clientId: editingProject.clientId.toString(),
                  address: editingProject.address,
                  location: editingProject.location as any,
                  budget: editingProject.budget,
                  manager: editingProject.manager,
                }
              : undefined
          }
          isEditMode={true}
        />
      </Modal>

      {/* Sidebar */}
      <div className="w-64 bg-[#1e1f25] text-white flex flex-col flex-shrink-0">
        {/* New Project Button */}
        <div className="p-4 space-y-2">
          <button
            className="w-full flex items-center justify-between bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            onClick={() => setIsNewProjectModalOpen(true)}
          >
            <span>+ Νέο Project</span>
          </button>
          <button
            className="w-full flex items-center justify-between bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => setIsNewClientModalOpen(true)}
          >
            <span>+ Νέος Πελάτης</span>
          </button>
        </div>

        {/* Clients List */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-2 text-sm text-gray-400 uppercase tracking-wide">
            Πελάτες ({clients.length})
          </div>

          {isLoadingClients ? (
            <div className="px-4 py-2 text-sm text-gray-400">
              Φόρτωση πελατών...
            </div>
          ) : clients.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-400">
              Δεν υπάρχουν πελάτες
            </div>
          ) : (
            clients.map((client) => (
              <div key={client.id} className="mb-1">
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-[#2a2b32] transition-colors ${
                    selectedClient === client.id ? "bg-[#2a2b32]" : ""
                  }`}
                  onClick={() => setSelectedClient(client.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{client.name}</span>
                    <div className="flex items-center space-x-2">
                      {client.projects.length > 0 && (
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                          {client.projects.length}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClient(client);
                        }}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                        title="Επεξεργασία πελάτη"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {client.email}
                  </div>
                </button>
                {client.projects.length > 0 && selectedClient === client.id && (
                  <div className="bg-[#2a2b32]">
                    {client.projects.map((project) => (
                      <div
                        key={project.id}
                        className="px-8 py-2 text-sm hover:bg-[#353640] transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{project.name}</div>
                            <div className="text-xs text-gray-400">
                              {project.manager} • €
                              {project.budget.toLocaleString()}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProject(project);
                            }}
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                            title="Επεξεργασία project"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-auto">
        <div className="container mx-auto p-4">
          {/* Project Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <h1 className="text-xl font-bold mb-4">
                  {projectSchedule.clientName} | {projectSchedule.projectName}
                </h1>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500">Εργασίες Καθημερινές:</span>
                    <span className="ml-2">{projectSchedule.regularHours}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">
                      Εργασίες Σαββατοκύριακα:
                    </span>
                    <span className="ml-2">
                      {projectSchedule.overtimeHours}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Τρέχων Τιμολόγησης</h3>
                <div>
                  <span className="text-gray-500">Τρέχων Τιμολόγησης:</span>
                  <span className="ml-2">
                    {projectSchedule.ratePerHour}€/hr
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">ΠΡΟΪΣΤΑΜΕΝΟΣ</h3>
                <div className="text-gray-600">
                  {projectSchedule.supervisor}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">ΤΟΠΟΘΕΣΙΑ</h3>
                <div className="text-gray-600">{projectSchedule.location}</div>
              </div>
            </div>
          </div>

          {/* Schedule Controls */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gray-100 rounded-lg">
                Διαδόχηση
              </button>
              <button className="px-4 py-2 bg-gray-100 rounded-lg">
                Τμήμα
              </button>
              <button className="px-4 py-2 bg-gray-100 rounded-lg">
                Υποκατάστημα
              </button>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Αναζήτηση"
                className="px-4 py-2 border rounded-lg"
              />
              <button className="ml-4 px-6 py-2 bg-green-500 text-white rounded-lg">
                Προσθήκη εργαζομένου
              </button>
            </div>
          </div>

          {/* Schedule Grid */}
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    Month
                  </th>
                  {weeks.map((week, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {week}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projectSchedule.employees.map((employee, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {employee.employeeName}
                    </td>
                    {employee.shifts.map((shift, idx) => (
                      <td
                        key={idx}
                        className={`px-6 py-4 text-center text-sm ${
                          shift === "BT"
                            ? "bg-green-100"
                            : shift === "A"
                            ? "bg-yellow-100"
                            : "bg-white"
                        }`}
                      >
                        {shift}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Summary Row */}
                <tr className="bg-gray-50 font-medium">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ΣΥΝΟΛΟ ΩΡΩΝ
                  </td>
                  {Array(14)
                    .fill(null)
                    .map((_, idx) => (
                      <td key={idx} className="px-6 py-4 text-center text-sm">
                        {idx % 2 === 0 ? "64" : "56"}
                      </td>
                    ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Weekly Summary */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">ΣΥΝΟΛΑ ΕΒΔΟΜΑΔΑΣ</h2>
            <div className="grid grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <h3 className="text-gray-500 mb-2">ΣΥΝΟΛΟ ΩΡΩΝ</h3>
                <div className="text-3xl font-bold">
                  {projectSchedule.weeklySummary[0].totalHours}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <h3 className="text-gray-500 mb-2">Capacity Παραγωγής</h3>
                <div className="text-3xl font-bold">
                  {projectSchedule.weeklySummary[0].capacity.toFixed(2)}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <h3 className="text-gray-500 mb-2">Έσοδα (€)</h3>
                <div className="text-3xl font-bold text-green-500">
                  {projectSchedule.weeklySummary[0].budget.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
