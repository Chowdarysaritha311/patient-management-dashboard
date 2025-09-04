import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, MapPin, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';

const CITIES = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
  "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
  "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis",
  "Seattle", "Denver", "Washington"
];

export default function PatientForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingPatient, 
  isSubmitting 
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: ''
  });
  
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (editingPatient) {
      setFormData({
        name: editingPatient.name || '',
        email: editingPatient.email || '',
        phone: editingPatient.phone || '',
        city: editingPatient.city || ''
      });
    } else {
      setFormData({ name: '', email: '', phone: '', city: '' });
    }
    setErrors({});
  }, [editingPatient, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone must be exactly 10 digits';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatPhoneInput = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 10);
    
    if (limited.length >= 6) {
      return `(${limited.slice(0,3)}) ${limited.slice(3,6)}-${limited.slice(6)}`;
    } else if (limited.length >= 3) {
      return `(${limited.slice(0,3)}) ${limited.slice(3)}`;
    } else {
      return limited;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {editingPatient ? 'Edit Patient' : 'Add New Patient'}
          </DialogTitle>
        </DialogHeader>
        
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-gray-700">
              <User className="w-4 h-4" />
              Full Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`h-12 ${errors.name ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-blue-400 focus:ring-blue-400'}`}
              placeholder="Enter patient's full name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <X className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-gray-700">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`h-12 ${errors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-blue-400 focus:ring-blue-400'}`}
              placeholder="Enter patient's email"
            />
            {errors.email && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <X className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => {
                const formatted = formatPhoneInput(e.target.value);
                handleInputChange('phone', formatted);
              }}
              className={`h-12 ${errors.phone ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-blue-400 focus:ring-blue-400'}`}
              placeholder="(555) 123-4567"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <X className="w-3 h-3" />
                {errors.phone}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4" />
              City
            </Label>
            <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
              <SelectTrigger className={`h-12 ${errors.city ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-blue-400 focus:ring-blue-400'}`}>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.city && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <X className="w-3 h-3" />
                {errors.city}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {editingPatient ? 'Update Patient' : 'Add Patient'}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}    
