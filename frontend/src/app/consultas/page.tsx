'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar,
  Clock,
  Stethoscope,
  Video,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function ConsultasPage() {
  const proximasConsultas = [
    {
      id: 1,
      especialidade: 'Cardiologia',
      medico: 'Dr. João Silva',
      data: '20/11/2025',
      hora: '14:00',
      status: 'confirmada',
      tipo: 'video',
    },
    {
      id: 2,
      especialidade: 'Dermatologia',
      medico: 'Dra. Maria Santos',
      data: '22/11/2025',
      hora: '10:30',
      status: 'confirmada',
      tipo: 'video',
    },
    {
      id: 3,
      especialidade: 'Pediatria',
      medico: 'Dr. Carlos Mendes',
      data: '25/11/2025',
      hora: '16:00',
      status: 'pendente',
      tipo: 'video',
    },
  ];

  const consultasRecentes = [
    {
      id: 1,
      especialidade: 'Clínico Geral',
      medico: 'Dr. Pedro Costa',
      data: '05/11/2025',
      status: 'realizada',
    },
    {
      id: 2,
      especialidade: 'Oftalmologia',
      medico: 'Dra. Ana Paula',
      data: '28/10/2025',
      status: 'realizada',
    },
    {
      id: 3,
      especialidade: 'Ortopedia',
      medico: 'Dr. Roberto Lima',
      data: '15/10/2025',
      status: 'realizada',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmada':
        return <Badge variant="success">Confirmada</Badge>;
      case 'pendente':
        return <Badge variant="warning">Pendente</Badge>;
      case 'realizada':
        return <Badge variant="info">Realizada</Badge>;
      case 'cancelada':
        return <Badge variant="danger">Cancelada</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <DashboardLayout title="Consultas">
      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link href="/consultas/agendar">
          <Card className="hover:shadow-lg transition-all cursor-pointer h-full border-2 border-transparent hover:border-primary">
            <CardBody>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    Agendar Consulta
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Escolha data, horário e especialidade
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
            </CardBody>
          </Card>
        </Link>

        <Link href="/consultas/imediato">
          <Card className="hover:shadow-lg transition-all cursor-pointer h-full border-2 border-transparent hover:border-danger">
            <CardBody>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-danger to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    Atendimento Imediato
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Conecte-se agora com um médico disponível
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-danger" />
              </div>
            </CardBody>
          </Card>
        </Link>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Próximas Consultas
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {proximasConsultas.length}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-primary opacity-20" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Este Mês
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  5
                </p>
              </div>
              <Stethoscope className="w-10 h-10 text-success opacity-20" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Confirmadas
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {proximasConsultas.filter(c => c.status === 'confirmada').length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-success opacity-20" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Pendentes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {proximasConsultas.filter(c => c.status === 'pendente').length}
                </p>
              </div>
              <AlertCircle className="w-10 h-10 text-warning opacity-20" />
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Consultas */}
        <Card>
          <CardHeader
            action={
              <Link href="/consultas/historico">
                <Button variant="ghost" size="sm">
                  Ver todas
                </Button>
              </Link>
            }
          >
            Próximas Consultas
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {proximasConsultas.map((consulta) => (
                <div
                  key={consulta.id}
                  className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {consulta.especialidade}
                      </p>
                      {getStatusBadge(consulta.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {consulta.medico}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {consulta.data}
                      <Clock className="w-4 h-4 ml-3 mr-1" />
                      {consulta.hora}
                    </div>
                  </div>
                  {consulta.status === 'confirmada' && (
                    <Button variant="primary" size="sm">
                      <Video className="w-4 h-4 mr-1" />
                      Entrar
                    </Button>
                  )}
                </div>
              ))}

              {proximasConsultas.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Nenhuma consulta agendada
                  </p>
                  <Link href="/consultas/agendar">
                    <Button variant="primary" size="sm">
                      Agendar agora
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Consultas Recentes */}
        <Card>
          <CardHeader
            action={
              <Link href="/consultas/historico">
                <Button variant="ghost" size="sm">
                  Ver histórico completo
                </Button>
              </Link>
            }
          >
            Consultas Recentes
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {consultasRecentes.map((consulta) => (
                <div
                  key={consulta.id}
                  className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {consulta.especialidade}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {consulta.medico}
                      </p>
                      <p className="text-xs text-gray-500">
                        {consulta.data}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(consulta.status)}
                </div>
              ))}

              {consultasRecentes.length === 0 && (
                <div className="text-center py-8">
                  <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Nenhuma consulta realizada ainda
                  </p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Informações Importantes */}
      <Card className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <CardBody>
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                Importante sobre suas consultas
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Entre na consulta com até 10 minutos de antecedência</li>
                <li>• Tenha seus exames e documentos em mãos</li>
                <li>• Cancele com pelo menos 3 horas de antecedência</li>
                <li>• Para emergências, use o Atendimento Imediato</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
    </DashboardLayout>
  );
}
