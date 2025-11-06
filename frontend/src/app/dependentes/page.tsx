'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  User,
  Calendar,
  FileText,
} from 'lucide-react';

interface Dependent {
  id: number;
  name: string;
  cpf: string;
  birthDate: string;
  relationship: string;
  photoUrl?: string;
}

const MOCK_DEPENDENTS: Dependent[] = [
  {
    id: 1,
    name: 'Maria Silva Santos',
    cpf: '987.654.321-00',
    birthDate: '2015-03-10',
    relationship: 'Filha',
  },
  {
    id: 2,
    name: 'João Silva Santos',
    cpf: '456.789.123-00',
    birthDate: '2018-07-22',
    relationship: 'Filho',
  },
];

export default function DependentesPage() {
  const [dependents, setDependents] = useState<Dependent[]>(MOCK_DEPENDENTS);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    birthDate: '',
    relationship: '',
  });

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleOpenModal = (dependent?: Dependent) => {
    if (dependent) {
      setEditingId(dependent.id);
      setFormData({
        name: dependent.name,
        cpf: dependent.cpf,
        birthDate: dependent.birthDate,
        relationship: dependent.relationship,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        cpf: '',
        birthDate: '',
        relationship: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: '',
      cpf: '',
      birthDate: '',
      relationship: '',
    });
  };

  const handleSave = () => {
    if (editingId) {
      // Update existing
      setDependents(
        dependents.map((dep) =>
          dep.id === editingId ? { ...dep, ...formData } : dep
        )
      );
    } else {
      // Add new
      const newDependent: Dependent = {
        id: Math.max(...dependents.map((d) => d.id), 0) + 1,
        ...formData,
      };
      setDependents([...dependents, newDependent]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja remover este dependente?')) {
      setDependents(dependents.filter((dep) => dep.id !== id));
    }
  };

  return (
    <DashboardLayout title="Dependentes">
      {/* Header Action */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie os dependentes do seu plano
          </p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Dependente
        </Button>
      </div>

      {/* Dependents Grid */}
      {dependents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dependents.map((dependent) => {
            const age = calculateAge(dependent.birthDate);

            return (
              <Card key={dependent.id}>
                <CardBody>
                  <div className="flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-400 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-white">
                        {dependent.name.charAt(0)}
                      </span>
                    </div>

                    {/* Name and Relationship */}
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                      {dependent.name}
                    </h3>
                    <Badge variant="info" className="mb-4">
                      {dependent.relationship}
                    </Badge>

                    {/* Info */}
                    <div className="w-full space-y-2 mb-6">
                      <div className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-400">
                          Idade
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {age} anos
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-400">
                          CPF
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {dependent.cpf}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-400">
                          Nascimento
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(
                            dependent.birthDate + 'T00:00:00'
                          ).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleOpenModal(dependent)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(dependent.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhum dependente cadastrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Adicione dependentes para que eles também possam usar o plano
              </p>
              <Button variant="primary" onClick={() => handleOpenModal()}>
                <Plus className="w-5 h-5 mr-2" />
                Adicionar Primeiro Dependente
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingId ? 'Editar Dependente' : 'Novo Dependente'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <Input
                label="Nome Completo"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Maria Silva Santos"
                icon={<User className="w-5 h-5" />}
              />

              <Input
                label="CPF"
                type="text"
                value={formData.cpf}
                onChange={(e) =>
                  setFormData({ ...formData, cpf: e.target.value })
                }
                placeholder="000.000.000-00"
                icon={<FileText className="w-5 h-5" />}
              />

              <Input
                label="Data de Nascimento"
                type="date"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
                icon={<Calendar className="w-5 h-5" />}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Grau de Parentesco
                </label>
                <select
                  value={formData.relationship}
                  onChange={(e) =>
                    setFormData({ ...formData, relationship: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="Filho(a)">Filho(a)</option>
                  <option value="Cônjuge">Cônjuge</option>
                  <option value="Pai/Mãe">Pai/Mãe</option>
                  <option value="Irmão(ã)">Irmão(ã)</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCloseModal}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleSave}
                disabled={
                  !formData.name ||
                  !formData.cpf ||
                  !formData.birthDate ||
                  !formData.relationship
                }
              >
                <Check className="w-4 h-4 mr-2" />
                {editingId ? 'Salvar' : 'Adicionar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
