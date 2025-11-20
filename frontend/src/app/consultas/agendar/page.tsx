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

// Será preenchido dinamicamente

// Será preenchido dinamicamente

export default function Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    specialty: '',
    date: '',
    time: '',
    patient: '',
    notes: '',
  });
  const [specialties, setSpecialties] = useState<string[]>([]);
  // Horários fixos para testes
  const [availableTimes, setAvailableTimes] = useState<string[]>([
    '08:00', '08:30', '09:00', '09:30', '10:00',
    '10:30', '11:00', '11:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ]);
  const [patients, setPatients] = useState<Array<{ id: string; name: string; cpf: string; relationship?: string }>>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);


  // Buscar especialidades do beneficiário principal (usuário logado) usando /dashboard
  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;
    setLoadingSpecialties(true);

    fetch(`${apiBase}/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        const cpf = data?.usuario?.cpf;
        if (!cpf) throw new Error('CPF não encontrado no dashboard');
        return fetch(`${apiBase}/beneficiarios/${cpf}/especialidades`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => res.json())
      .then((data) => {
        // API pode retornar um array direto ou um objeto com campo `specialties`
        if (Array.isArray(data)) {
          // array de strings ou objetos
          if (data.length && typeof data[0] === 'object') {
            setSpecialties((data as any[]).map((s) => s.name || s));
          } else {
            setSpecialties(data as string[]);
          }
        } else if (data && Array.isArray(data.specialties)) {
          setSpecialties((data.specialties as any[]).map((s) => s.name || s));
        } else {
          setSpecialties([]);
        }
        setLoadingSpecialties(false);
      })
      .catch(() => setLoadingSpecialties(false));
  }, []);

  // Buscar pacientes (usuário + dependentes) do dashboard
  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;
    setLoadingPatients(true);
    fetch(`${apiBase}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const pacientes = [];
        // Usuário logado
        if (data?.usuario) {
          pacientes.push({
            id: data.usuario.cpf,
            name: data.usuario.nome,
            cpf: data.usuario.cpf,
            relationship: 'Titular',
          });
        }
        // Dependentes (beneficiarios)
        if (Array.isArray(data?.beneficiarios)) {
          data.beneficiarios.forEach((dep: any) => {
            pacientes.push({
              id: dep.cpf,
              name: dep.nome,
              cpf: dep.cpf,
              relationship: dep.relationship || 'Dependente',
            });
          });
        }
        setPatients(pacientes);
        setLoadingPatients(false);
      })
      .catch(() => setLoadingPatients(false));
  }, []);

  // Remover busca de horários da API: horários são fixos para testes

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

  const handleSubmit = async () => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return alert('Usuário não autenticado!');
    try {
      const res = await fetch(`${apiBase}/agendamentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          especialidade: formData.specialty,
          data: formData.date,
          horario: formData.time,
          pacienteId: formData.patient,
          observacoes: formData.notes,
        }),
      });
      if (!res.ok) throw new Error('Erro ao agendar consulta');
      alert('Consulta agendada com sucesso!');
    } catch (err: any) {
      alert(err.message || 'Erro ao agendar consulta');
    }
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
                {loadingSpecialties ? (
                  <div className="text-center text-gray-400">Carregando especialidades...</div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {specialties.map((specialty) => (
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
                )}
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
                {loadingTimes ? (
                  <div className="text-center text-gray-400">Carregando horários...</div>
                ) : availableTimes.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400">Nenhum horário disponível para esta especialidade e data.</div>
                ) : (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {availableTimes.map((time) => (
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
                )}
              </div>
            )}

            {/* Step 4: Paciente */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Para quem é a consulta?
                </p>
                {loadingPatients ? (
                  <div className="text-center text-gray-400">Carregando pacientes...</div>
                ) : (
                  <div className="space-y-3">
                    {patients.map((person) => (
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
                )}
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
