'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  Calendar,
  Clock,
  Stethoscope,
  FileText,
  Download,
  Search,
  Filter,
  User,
} from 'lucide-react';

type AppointmentStatus = 'completed' | 'cancelled' | 'missed';

interface Appointment {
  id: number;
  specialty: string;
  doctor: string;
  date: string;
  time: string;
  patient: string;
  status: AppointmentStatus;
  hasReport: boolean;
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    specialty: 'Cardiologia',
    doctor: 'Dr. João Silva',
    date: '2025-11-05',
    time: '14:00',
    patient: 'Você',
    status: 'completed',
    hasReport: true,
  },
  {
    id: 2,
    specialty: 'Pediatria',
    doctor: 'Dra. Maria Santos',
    date: '2025-10-20',
    time: '10:00',
    patient: 'Maria Silva',
    status: 'completed',
    hasReport: true,
  },
  {
    id: 3,
    specialty: 'Dermatologia',
    doctor: 'Dr. Carlos Oliveira',
    date: '2025-09-15',
    time: '16:00',
    patient: 'Você',
    status: 'completed',
    hasReport: false,
  },
  {
    id: 4,
    specialty: 'Clínico Geral',
    doctor: 'Dra. Ana Costa',
    date: '2025-08-10',
    time: '09:00',
    patient: 'João Silva',
    status: 'cancelled',
    hasReport: false,
  },
];

const STATUS_MAP: Record<
  AppointmentStatus,
  { label: string; variant: 'success' | 'danger' | 'warning' }
> = {
  completed: { label: 'Realizada', variant: 'success' },
  cancelled: { label: 'Cancelada', variant: 'danger' },
  missed: { label: 'Não compareceu', variant: 'warning' },
};

export default function HistoricoConsultasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSpecialty, setFilterSpecialty] = useState('all');

  const filteredAppointments = MOCK_APPOINTMENTS.filter((apt) => {
    const matchesSearch =
      apt.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patient.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || apt.status === filterStatus;

    const matchesSpecialty =
      filterSpecialty === 'all' || apt.specialty === filterSpecialty;

    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  return (
    <DashboardLayout title="Histórico de Consultas">
      <Card className="mb-6">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <Input
                type="text"
                placeholder="Buscar por especialidade, médico ou paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>

            {/* Filter by Status */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Todos os status</option>
                <option value="completed">Realizadas</option>
                <option value="cancelled">Canceladas</option>
                <option value="missed">Não compareceu</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => {
            const statusInfo = STATUS_MAP[appointment.status];

            return (
              <Card key={appointment.id}>
                <CardBody>
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    {/* Main Info */}
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Stethoscope className="w-6 h-6 text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {appointment.specialty}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {appointment.doctor}
                            </p>
                          </div>
                          <Badge variant={statusInfo.variant}>
                            {statusInfo.label}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(
                              appointment.date + 'T00:00:00'
                            ).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {appointment.time}
                          </div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            {appointment.patient}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Ver Detalhes
                      </Button>

                      {appointment.hasReport && (
                        <Button variant="primary" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Laudo
                        </Button>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhuma consulta encontrada
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Tente ajustar os filtros ou termos de busca
                </p>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Summary Stats */}
      {filteredAppointments.length > 0 && (
        <Card className="mt-6">
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {
                    MOCK_APPOINTMENTS.filter((a) => a.status === 'completed')
                      .length
                  }
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Realizadas
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-danger">
                  {
                    MOCK_APPOINTMENTS.filter((a) => a.status === 'cancelled')
                      .length
                  }
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Canceladas
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-warning">
                  {MOCK_APPOINTMENTS.filter((a) => a.status === 'missed').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Perdidas
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {MOCK_APPOINTMENTS.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Total
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </DashboardLayout>
  );
}
