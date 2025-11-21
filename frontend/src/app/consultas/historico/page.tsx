'use client';

import { useState, useEffect } from 'react';
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
  Loader2,
} from 'lucide-react';

type AppointmentStatus = 'completed' | 'cancelled' | 'missed';

interface Appointment {
  id: string;
  uuid: string;
  specialty: string;
  doctor: string;
  date: string;
  time: string;
  patient: string;
  status: AppointmentStatus;
  hasReport: boolean;
  from?: string;
  to?: string;
}

interface AppointmentApi {
  uuid: string;
  status: string;
  date?: string;
  from?: string;
  to?: string;
  specialty?: {
    name?: string;
    uuid?: string;
  };
  professional?: {
    name?: string;
  };
  beneficiary?: {
    name?: string;
  };
  detail?: {
    date?: string;
    from?: string;
    to?: string;
  };
}

const STATUS_MAP: Record<
  AppointmentStatus,
  { label: string; variant: 'success' | 'danger' | 'warning' }
> = {
  completed: { label: 'Realizada', variant: 'success' },
  cancelled: { label: 'Cancelada', variant: 'danger' },
  missed: { label: 'Não compareceu', variant: 'warning' },
};

export default function HistoricoConsultasPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSpecialty, setFilterSpecialty] = useState('all');

  // Buscar agendamentos do backend
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        if (!token) {
          setLoading(false);
          return;
        }

        // Buscar dados do dashboard para obter CPF
        const dashboardRes = await fetch(`${apiBase}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!dashboardRes.ok) {
          throw new Error('Erro ao buscar dados do dashboard');
        }

        const dashboardData = await dashboardRes.json();
        const cpf = dashboardData?.usuario?.cpf;

        if (!cpf) {
          throw new Error('CPF não encontrado');
        }

        // Buscar beneficiário pelo CPF para obter UUID
        const beneficiaryRes = await fetch(`${apiBase}/rapidoc/beneficiario/${cpf}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!beneficiaryRes.ok) {
          throw new Error('Erro ao buscar beneficiário');
        }

        const beneficiaryData = await beneficiaryRes.json();
        const uuid = beneficiaryData?.uuid;

        if (!uuid) {
          throw new Error('UUID do beneficiário não encontrado');
        }

        // Buscar todos os agendamentos do beneficiário
        const appointmentsRes = await fetch(`${apiBase}/beneficiarios/${uuid}/appointments`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (appointmentsRes.ok) {
          const appointmentsData = await appointmentsRes.json();
          const apiAppointments: AppointmentApi[] = appointmentsData?.appointments || [];
          
          // Filtrar apenas agendamentos já realizados/completados/cancelados
          const historicalAppointments = apiAppointments.filter((apt: AppointmentApi) => {
            const status = apt?.status?.toUpperCase();
            return status === 'COMPLETED' || status === 'CANCELED' || status === 'CANCELLED' || status === 'MISSED';
          });

          // Mapear para o formato da interface
          const mappedAppointments: Appointment[] = historicalAppointments.map((apt: AppointmentApi) => {
            const date = apt.detail?.date || apt.date || '';
            const from = apt.detail?.from || apt.from || '';
            const to = apt.detail?.to || apt.to || '';
            const doctorName = apt.professional?.name || 'Médico não informado';
            const specialtyName = apt.specialty?.name || 'Especialidade não informada';
            const patientName = apt.beneficiary?.name || 'Você';
            
            // Converter status da API para o formato da interface
            let status: AppointmentStatus = 'completed';
            const apiStatus = apt.status?.toUpperCase();
            if (apiStatus === 'CANCELED' || apiStatus === 'CANCELLED') {
              status = 'cancelled';
            } else if (apiStatus === 'MISSED') {
              status = 'missed';
            } else if (apiStatus === 'COMPLETED') {
              status = 'completed';
            }

            // Formatar hora
            const time = from || '00:00';

            return {
              id: apt.uuid,
              uuid: apt.uuid,
              specialty: specialtyName,
              doctor: doctorName,
              date: date,
              time: time,
              patient: patientName,
              status: status,
              hasReport: false, // Por enquanto, não temos informação de laudo na API
              from: from,
              to: to,
            };
          });

          // Ordenar por data (mais recentes primeiro)
          mappedAppointments.sort((a, b) => {
            if (!a.date || !b.date) return 0;
            // Converter dd/MM/yyyy para Date
            const [da, ma, aa] = a.date.split('/');
            const [db, mb, ab] = b.date.split('/');
            const dateA = new Date(`${aa}-${ma}-${da}`);
            const dateB = new Date(`${ab}-${mb}-${db}`);
            return dateB.getTime() - dateA.getTime();
          });

          setAllAppointments(mappedAppointments);
          setAppointments(mappedAppointments);
        }
      } catch (error) {
        console.error('Erro ao carregar histórico de consultas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // Filtrar agendamentos
  useEffect(() => {
    const filtered = allAppointments.filter((apt) => {
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

    setAppointments(filtered);
  }, [searchTerm, filterStatus, filterSpecialty, allAppointments]);

  // Obter lista única de especialidades para o filtro
  const specialties = Array.from(
    new Set(allAppointments.map((apt) => apt.specialty))
  ).sort();

  const handleViewDetails = async (uuid: string) => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      if (!token) {
        alert('Token não encontrado. Por favor, faça login novamente.');
        return;
      }

      // Buscar detalhes do agendamento
      const res = await fetch(`${apiBase}/agendamentos/${uuid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const appointment = data?.appointment || data;
        
        // Mostrar detalhes em um alert (ou você pode criar um modal)
        const details = `
Especialidade: ${appointment.specialty?.name || 'N/A'}
Médico: ${appointment.professional?.name || 'N/A'}
Data: ${appointment.detail?.date || appointment.date || 'N/A'}
Horário: ${appointment.detail?.from || appointment.from || 'N/A'} - ${appointment.detail?.to || appointment.to || 'N/A'}
Status: ${appointment.status || 'N/A'}
        `.trim();
        
        alert(details);
      } else {
        alert('Erro ao buscar detalhes da consulta');
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
      alert('Erro ao buscar detalhes da consulta');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Histórico de Consultas">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Carregando histórico...</span>
        </div>
      </DashboardLayout>
    );
  }

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

          {/* Filter by Specialty */}
          {specialties.length > 0 && (
            <div className="mt-4">
              <select
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Todas as especialidades</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((appointment) => {
            const statusInfo = STATUS_MAP[appointment.status];

            // Converter data para formato brasileiro se necessário
            let formattedDate = appointment.date;
            if (appointment.date && appointment.date.includes('/')) {
              // Já está em formato dd/MM/yyyy
              formattedDate = appointment.date;
            } else if (appointment.date) {
              // Tentar converter de yyyy-MM-dd para dd/MM/yyyy
              try {
                const [year, month, day] = appointment.date.split('-');
                formattedDate = `${day}/${month}/${year}`;
              } catch {
                formattedDate = appointment.date;
              }
            }

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
                            {formattedDate ? (
                              formattedDate.includes('/') ? (
                                formattedDate
                              ) : (
                                new Date(formattedDate + 'T00:00:00').toLocaleDateString('pt-BR')
                              )
                            ) : (
                              'Data não informada'
                            )}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {appointment.time}
                            {appointment.to && ` - ${appointment.to}`}
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(appointment.uuid)}
                      >
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
                  {allAppointments.length === 0 
                    ? 'Nenhuma consulta no histórico'
                    : 'Nenhuma consulta encontrada'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {allAppointments.length === 0
                    ? 'Você ainda não possui consultas realizadas no histórico'
                    : 'Tente ajustar os filtros ou termos de busca'}
                </p>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Summary Stats */}
      {allAppointments.length > 0 && (
        <Card className="mt-6">
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {allAppointments.filter((a) => a.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Realizadas
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-danger">
                  {allAppointments.filter((a) => a.status === 'cancelled').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Canceladas
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-warning">
                  {allAppointments.filter((a) => a.status === 'missed').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Perdidas
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {allAppointments.length}
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
