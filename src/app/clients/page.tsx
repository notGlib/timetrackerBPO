"use client";

import { useState } from "react";

type ProjectLocation = "inhouse" | "on_client_site";

interface Project {
  id: string;
  clientId: string;
  name: string;
  address: string;
  location: ProjectLocation;
  budget: number;
  projectManager: string;
  createdAt: Date;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  projects: Project[];
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [projectForm, setProjectForm] = useState({
    name: "",
    address: "",
    location: "inhouse" as ProjectLocation,
    budget: "",
    projectManager: "",
  });
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleProjectInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProjectForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Name and email are required!");
      return;
    }

    const newClient: Client = {
      id: Math.random().toString(36).substring(7),
      ...formData,
      createdAt: new Date(),
      projects: [],
    };

    setClients((prev) => [...prev, newClient]);
    setFormData({
      name: "",
      email: "",
      phone: "",
    });
  };
  const handleProjectSubmit = (clientId: string, e: React.FormEvent) => {
    e.preventDefault();

    if (!projectForm.name.trim() || !projectForm.projectManager.trim()) {
      alert("Project name and project manager are required!");
      return;
    }

    const newProject: Project = {
      id: Math.random().toString(36).substring(7),
      clientId,
      name: projectForm.name.trim(),
      address: projectForm.address.trim(),
      location: projectForm.location,
      budget: parseFloat(projectForm.budget) || 0,
      projectManager: projectForm.projectManager.trim(),
      createdAt: new Date(),
    };

    setClients((prev) =>
      prev.map((client) =>
        client.id === clientId
          ? { ...client, projects: [...client.projects, newProject] }
          : client
      )
    );

    setProjectForm({
      name: "",
      address: "",
      location: "inhouse",
      budget: "",
      projectManager: "",
    });
    setSelectedClientId(null);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Clients & Projects</h1>

      {/* Client Form */}
      <div className="max-w-md mx-auto mb-8 p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-600">
          Add New Client
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter client name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter client email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter client phone"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Client
          </button>
        </form>
      </div>

      {/* Clients List */}
      <div className="max-w-4xl mx-auto">
        {clients.map((client) => (
          <div
            key={client.id}
            className="mb-4 p-6 bg-white rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-600">
                  {client.name}
                </h3>
                <p className="text-sm text-gray-600">{client.email}</p>
                {client.phone && (
                  <p className="text-sm text-gray-600">{client.phone}</p>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {client.createdAt.toLocaleDateString()}
              </span>
            </div>

            {/* Project Form */}
            {selectedClientId === client.id ? (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-md font-medium mb-3 text-gray-600">
                  Add New Project
                </h4>
                <form
                  onSubmit={(e) => handleProjectSubmit(client.id, e)}
                  className="space-y-3"
                >
                  {" "}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={projectForm.name}
                      onChange={handleProjectInputChange}
                      placeholder="Enter project name"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={projectForm.address}
                      onChange={handleProjectInputChange}
                      placeholder="Enter project address"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <select
                      name="location"
                      value={projectForm.location}
                      onChange={handleProjectInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                      required
                    >
                      <option value="inhouse">In-house</option>
                      <option value="on_client_site">On Client Site</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={projectForm.budget}
                      onChange={handleProjectInputChange}
                      placeholder="Enter project budget"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Manager *
                    </label>
                    <input
                      type="text"
                      name="projectManager"
                      value={projectForm.projectManager}
                      onChange={handleProjectInputChange}
                      placeholder="Enter project manager name"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Save Project
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedClientId(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={() => setSelectedClientId(client.id)}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Project
              </button>
            )}

            {/* Projects List */}
            {client.projects.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2 text-gray-600">Projects:</h4>
                <div className="space-y-2">
                  {client.projects.map((project) => (
                    <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-gray-700">
                            {project.name}
                          </h5>
                          <p className="text-sm text-gray-600 mt-1">
                            {project.address}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            Manager: {project.projectManager}
                          </p>
                          <p className="text-sm text-gray-600">
                            Location:{" "}
                            {project.location === "inhouse"
                              ? "In-house"
                              : "On Client Site"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            Budget: ${project.budget.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500">
                            Created: {project.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {clients.length === 0 && (
          <p className="text-center text-gray-500 italic">
            No clients yet. Add your first client above!
          </p>
        )}
      </div>
    </div>
  );
}
