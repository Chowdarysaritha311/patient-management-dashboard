import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpDown, ArrowUp, ArrowDown, Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PatientTable({ 
  patients, 
  sortConfig, 
  onSort, 
  onEdit, 
  onDelete,
  isLoading 
}) {
  const getSortIcon = (field) => {
    if (sortConfig.field !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm border-gray-100">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-gray-600">Loading patients...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-gray-100 overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-100">
                <TableHead className="py-4 px-6">
                  <Button
                    variant="ghost"
                    onClick={() => onSort('name')}
                    className="h-auto p-0 font-semibold text-gray-700 hover:text-blue-600 flex items-center gap-2"
                  >
                    Name {getSortIcon('name')}
                  </Button>
                </TableHead>
                <TableHead className="py-4 px-6">
                  <Button
                    variant="ghost"
                    onClick={() => onSort('email')}
                    className="h-auto p-0 font-semibold text-gray-700 hover:text-blue-600 flex items-center gap-2"
                  >
                    Email {getSortIcon('email')}
                  </Button>
                </TableHead>
                <TableHead className="py-4 px-6 font-semibold text-gray-700">Phone</TableHead>
                <TableHead className="py-4 px-6 font-semibold text-gray-700">City</TableHead>
                <TableHead className="py-4 px-6 font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {patients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                      No patients found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  patients.map((patient, index) => (
                    <motion.tr
                      key={patient.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
                    >
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                            <span className="text-blue-700 font-semibold text-sm">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{patient.name}</p>
                            <p className="text-sm text-gray-500">ID: {patient.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{patient.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{formatPhone(patient.phone)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 flex items-center gap-1 w-fit">
                          <MapPin className="w-3 h-3" />
                          {patient.city}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(patient)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(patient.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}  
