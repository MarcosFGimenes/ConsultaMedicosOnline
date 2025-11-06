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
  User,
  FileText,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Stethoscope,
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Especialidade', icon: Stethoscope },
  { id: 2, title: 'Data', icon: Calendar },
  { id: 3, title: 'Horário', icon: Clock },
  { id: 4, title: 'Paciente', icon: User },
  { id: 5, title: 'Observações', icon: FileText },
  { id: 6, title: 'Confirmação', icon: CheckCircle },
];

const SPECIALTIES = [
  'Cardiologia',
  'Dermatologia',
  'Pediatria',
  'Psicologia',
  'Clínico Geral',
  'Ortopedia',
  'Ginecologia',
  'Oftalmologia',
];

const AVAILABLE_TIMES = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export default function AgendarConsultaPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    specialty: '',
    date: '',
    time: '',
    patient: '',
    notes: '',
  });

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Agendamento:', formData);
    // Aqui faria a chamada à API
  };

  return (
    <DashboardLayout title="Agendar Consulta">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <Card className="mb-6">
          <CardBody>
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          isCompleted
                            ? 'bg-success text-white'
                            : isActive
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <p
                        className={`text-xs font-medium text-center hidden md:block ${
                          isActive
                            ? 'text-primary'
                            : isCompleted
                            ? 'text-success'
                            : 'text-gray-500'
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 mx-2 ${
                          isCompleted
                            ? 'bg-success'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">
              {STEPS[currentStep - 1].title}
            </h2>
          </CardHeader>
          <CardBody>
            {/* Step 1: Especialidade */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Selecione a especialidade médica desejada
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SPECIALTIES.map((specialty) => (
                    <button
                      key={specialty}
                      onClick={() =>
                        setFormData({ ...formData, specialty })
                      }
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        formData.specialty === specialty
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      }`}
                    >
                      <Stethoscope
                        className={`w-6 h-6 mb-2 ${
                          formData.specialty === specialty
                            ? 'text-primary'
                            : 'text-gray-400'
                        }`}
                      />
                      <p className="font-medium text-gray-900 dark:text-white">
                        {specialty}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Data */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Escolha a data da consulta
                </p>
                <Input
                  type="date"
                  label="Data da Consulta"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  min={new Date().toISOString().split('T')[0]}
                />
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Dica:</strong> Consultas podem ser agendadas com
                    até 30 dias de antecedência.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Horário */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Selecione o horário disponível
                </p>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {AVAILABLE_TIMES.map((time) => (
                    <button
                      key={time}
                      onClick={() => setFormData({ ...formData, time })}
                      className={`p-3 rounded-lg border-2 transition-all font-medium ${
                        formData.time === time
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Paciente */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Para quem é a consulta?
                </p>
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
                      onClick={() =>
                        setFormData({ ...formData, patient: person.id })
                      }
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        formData.patient === person.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
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
                        {formData.patient === person.id && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Observações */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Adicione informações importantes (opcional)
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={6}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Ex: Sintomas, medicamentos em uso, alergias..."
                  />
                </div>
              </div>
            )}

            {/* Step 6: Confirmação */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="bg-green-50 dark:bg-slate-800 p-6 rounded-xl text-center">
                  <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Revise os dados da consulta
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Verifique se todas as informações estão corretas
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Stethoscope className="w-5 h-5 text-primary" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Especialidade
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formData.specialty || '-'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Data
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formData.date
                        ? new Date(formData.date + 'T00:00:00').toLocaleDateString(
                            'pt-BR'
                          )
                        : '-'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Horário
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formData.time || '-'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-primary" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Paciente
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formData.patient || '-'}
                    </span>
                  </div>

                  {formData.notes && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="flex items-center space-x-3 mb-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Observações
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white ml-8">
                        {formData.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !formData.specialty) ||
                    (currentStep === 2 && !formData.date) ||
                    (currentStep === 3 && !formData.time) ||
                    (currentStep === 4 && !formData.patient)
                  }
                >
                  Próximo
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button variant="primary" onClick={handleSubmit}>
                  Confirmar Agendamento
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
