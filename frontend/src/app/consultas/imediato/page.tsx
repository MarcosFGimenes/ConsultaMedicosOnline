'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Stethoscope,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Video,
  Phone,
} from 'lucide-react';

export default function AtendimentoImediatoPage() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [waitingDoctors, setWaitingDoctors] = useState(3);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(5);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'video' | 'phone' | ''>(
    ''
  );

  const handleStartConsultation = () => {
    console.log('Iniciando consulta imediata:', {
      patient: selectedPatient,
      method: selectedMethod,
    });
    // Aqui faria a chamada à API
  };

  return (
    <DashboardLayout title="Atendimento Imediato">
      {/* Availability Status */}
      <Card className="mb-6">
        <CardBody>
          {isAvailable ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Médicos Disponíveis
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {waitingDoctors} médicos aguardando para atendimento
                  </p>
                </div>
              </div>
              <Badge variant="success" className="text-base px-4 py-2">
                Disponível
              </Badge>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-danger" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Sem Disponibilidade No Momento
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tente novamente em alguns minutos ou agende uma consulta
                  </p>
                </div>
              </div>
              <Badge variant="danger" className="text-base px-4 py-2">
                Indisponível
              </Badge>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardBody>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Médicos Disponíveis
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {waitingDoctors}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tempo Estimado
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ~{estimatedWaitTime} min
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tipo de Atendimento
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Telemedicina
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Form */}
      {isAvailable && (
        <Card>
          <CardHeader>Iniciar Atendimento</CardHeader>
          <CardBody>
            {/* Patient Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Para quem é o atendimento?
              </label>
              <div className="space-y-3">
                {[
                  { id: 'self', name: 'Você', cpf: '123.456.789-00' },
                  {
                    id: 'dep1',
                    name: 'Maria Silva',
                    cpf: '987.654.321-00',
                    relationship: 'Filha',
                  },
                  {
                    id: 'dep2',
                    name: 'João Silva',
                    cpf: '456.789.123-00',
                    relationship: 'Filho',
                  },
                ].map((person) => (
                  <button
                    key={person.id}
                    onClick={() => setSelectedPatient(person.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedPatient === person.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {person.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {person.cpf}
                            {person.relationship &&
                              ` • ${person.relationship}`}
                          </p>
                        </div>
                      </div>
                      {selectedPatient === person.id && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Consultation Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Como deseja ser atendido?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedMethod('video')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedMethod === 'video'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                        selectedMethod === 'video'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                      }`}
                    >
                      <Video className="w-8 h-8" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Videochamada
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Consulta por vídeo com o médico
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedMethod('phone')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedMethod === 'phone'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                        selectedMethod === 'phone'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                      }`}
                    >
                      <Phone className="w-8 h-8" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Ligação Telefônica
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Consulta por telefone
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Important Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  <p className="font-semibold mb-2">Informações Importantes:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      O atendimento será realizado por um clínico geral
                      disponível
                    </li>
                    <li>Tempo estimado de espera: ~{estimatedWaitTime} minutos</li>
                    <li>
                      Mantenha seu dispositivo com câmera e microfone
                      funcionando
                    </li>
                    <li>
                      Você receberá uma notificação quando o médico estiver
                      pronto
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleStartConsultation}
              disabled={!selectedPatient || !selectedMethod}
            >
              <Stethoscope className="w-5 h-5 mr-2" />
              Iniciar Atendimento Imediato
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Not Available - Alternative Actions */}
      {!isAvailable && (
        <Card>
          <CardHeader>Outras Opções</CardHeader>
          <CardBody>
            <div className="space-y-3">
              <Button variant="primary" size="lg" className="w-full">
                <Clock className="w-5 h-5 mr-2" />
                Agendar Consulta
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                <AlertCircle className="w-5 h-5 mr-2" />
                Notificar quando disponível
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </DashboardLayout>
  );
}
