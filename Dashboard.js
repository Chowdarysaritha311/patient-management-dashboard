
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Patient } from '@/entities/Patient';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, UserCheck, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

import SearchBar from '../components/dashboard/SearchBar';
import PatientTable from '../components/dashboard/PatientTable';
import PatientForm from '../components/dashboard/PatientForm';
import Pagination from '../components/dashboard/Pagination';
import { ToastContainer } from '../components/dashboard/Toast';

// Simulate API data from JSONPlaceholder
const simulatedApiData = [
  { id: 1, name: "Leanne Graham", email: "Sincere@april.biz", phone: "1-770-736-8031", city: "Gwenborough", external_id: 1 },
  { id: 2, name: "Ervin Howell", email: "Shanna@melissa.tv", phone: "010-692-6593", city: "Wisokyburgh", external_id: 2 },
  { id: 3, name: "Clementine Bauch", email: "Nathan@yesenia.net", phone: "1-463-123-4447", city: "McKenziehaven", external_id: 3 },
  { id: 4, name: "Patricia Lebsack", email: "Julianne.OConner@kory.org", phone: "493-170-9623", city: "South Elvis", external_id: 4 },
  { id: 5, name: "Chelsey Dietrich", email: "Lucio_Hettinger@annie.ca", phone: "254-954-1289", city: "Roscoeview", external_id: 5 },
  { id: 6, name: "Mrs. Dennis Schulist", email: "Karley_Dach@jasper.info", phone: "1-477-935-8478", city: "South Christy", external_id: 6 },
  { id: 7, name: "Kurtis Weissnat", email: "Telly.Hoeger@billy.biz", phone: "210-067-6132", city: "Howemouth", external_id: 7 },
  { id: 8, name: "Nicholas Runolfsdottir", email: "Sherwood@rosamond.me", phone: "586-493-6943", city: "Aliyaview", external_id: 8 },
  { id: 9, name: "Glenna Reichert", email: "Chaim_McDermott@dana.io", phone: "775-976-6794", city: "Bartholomebury", external_id: 9 },
  { id: 10, name: "Clementina DuBuque", email: "Rey.Padberg@karina.biz", phone: "024-648-3804", city: "Lebsackbury", external_id: 10 }
];

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [sortConfig, setSortConfig] = useState({ field: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);

  const itemsPerPage = 5;

  const showToast = useCallback((type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const loadPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load existing patients
      const existingPatients = await Patient.list();
      
      // If no existing patients, load from simulated API
      if (existingPatients.length === 0) {
        const apiPatients = await Promise.all(
          simulatedApiData.map(patient => Patient.create(patient))
        );
        setPatients(apiPatients);
        showToast('success', 'Patient data loaded successfully');
      } else {
        setPatients(existingPatients);
      }
    } catch (error) {
      showToast('error', 'Failed to load patient data');
      console.error('Error loading patients:', error);
    } finally {
      setIsLoading(false);
    }
  }, [showToast]); // showToast is a dependency because it's called inside loadPatients

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Get unique cities for filter
  const cities = useMemo(() => {
    return [...new Set(patients.map(patient => patient.city))].sort();
  }, [patients]);

  // Filter and sort patients
  const filteredAndSortedPatients = useMemo(() => {
    let filtered = patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === 'all' || patient.city === selectedCity;
      return matchesSearch && matchesCity;
    });

    // Sort patients
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.field]?.toLowerCase() || '';
      const bValue = b[sortConfig.field]?.toLowerCase() || '';
      
      if (sortConfig.direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return filtered;
  }, [patients, searchTerm, selectedCity, sortConfig]);

  // Paginate patients
  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedPatients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedPatients, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedPatients.length / itemsPerPage);

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleAddPatient = () => {
    setEditingPatient(null);
    setShowForm(true);
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleDeletePatient = async (patientId) => {
    try {
      await Patient.delete(patientId);
      setPatients(prev => prev.filter(p => p.id !== patientId));
      showToast('success', 'Patient deleted successfully');
    } catch (error) {
      showToast('error', 'Failed to delete patient');
    }
  };

  const handleSubmitForm = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingPatient) {
        const updatedPatient = await Patient.update(editingPatient.id, formData);
        setPatients(prev => prev.map(p => p.id === editingPatient.id ? updatedPatient : p));
        showToast('success', 'Patient updated successfully');
      } else {
        const newPatient = await Patient.create(formData);
        setPatients(prev => [newPatient, ...prev]);
        showToast('success', 'Patient added successfully');
      }
      setShowForm(false);
      setEditingPatient(null);
    } catch (error) {
      showToast('error', 'Failed to save patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCity]);

  const stats = [
    {
      title: "Total Patients",
      value: patients.length,
      icon: Users,
      color: "bg-blue-500",
      change: "+12%"
    },
    {
      title: "Active Today",
      value: Math.floor(patients.length * 0.3),
      icon: UserCheck,
      color: "bg-green-500",
      change: "+5%"
    },
    {
      title: "Cities Covered",
      value: cities.length,
      icon: MapPin,
      color: "bg-purple-500",
      change: "2 new"
    },
    {
      title: "Avg Response Time",
      value: "2.4 min",
      icon: Clock,
      color: "bg-orange-500",
      change: "-1.2 min"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Patient Management
            </h1>
            <p className="text-gray-600 text-lg">
              Comprehensive healthcare dashboard for patient records
            </p>
          </div>
          <Button
            onClick={handleAddPatient}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Patient
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={stat.title} className="shadow-sm border-gray-100 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                    <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </CardTitle>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            cities={cities}
          />
        </motion.div>

        {/* Patient Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PatientTable
            patients={paginatedPatients}
            sortConfig={sortConfig}
            onSort={handleSort}
            onEdit={handleEditPatient}
            onDelete={handleDeletePatient}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Pagination */}
        {!isLoading && filteredAndSortedPatients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={filteredAndSortedPatients.length}
            />
          </motion.div>
        )}

        {/* Patient Form Modal */}
        <PatientForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingPatient(null);
          }}
          onSubmit={handleSubmitForm}
          editingPatient={editingPatient}
          isSubmitting={isSubmitting}
        />

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    </div>
  );
}    
