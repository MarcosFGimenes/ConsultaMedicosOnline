'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  MapPin,
  Lock,
  Save,
} from 'lucide-react';

type TabType = 'personal' | 'address' | 'security';

export default function MeusDadosPage() {
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [personalData, setPersonalData] = useState({
    name: 'Gustavo Silva Santos',
    email: 'gustavo@email.com',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    birthDate: '1990-05-15',
    gender: 'M',
  });

  const [addressData, setAddressData] = useState({
    zipCode: '12345-678',
    street: 'Rua das Flores',
    number: '123',
    complement: 'Apto 45',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const tabs = [
    { id: 'personal' as TabType, label: 'Dados Pessoais', icon: User },
    { id: 'address' as TabType, label: 'Endereço', icon: MapPin },
    { id: 'security' as TabType, label: 'Segurança', icon: Lock },
  ];

  const handleSave = () => {
    console.log('Salvando dados...', {
      activeTab,
      personalData,
      addressData,
      securityData,
    });
    // Aqui faria a chamada à API
  };

  return (
    <DashboardLayout title="Meus Dados">
      <div className="max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <Card>
          <CardHeader>
            {activeTab === 'personal' && 'Dados Pessoais'}
            {activeTab === 'address' && 'Endereço'}
            {activeTab === 'security' && 'Segurança'}
          </CardHeader>
          <CardBody>
            {/* Personal Data Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <Input
                  label="Nome Completo"
                  type="text"
                  value={personalData.name}
                  onChange={(e) =>
                    setPersonalData({ ...personalData, name: e.target.value })
                  }
                  icon={<User className="w-5 h-5" />}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    value={personalData.email}
                    onChange={(e) =>
                      setPersonalData({
                        ...personalData,
                        email: e.target.value,
                      })
                    }
                    icon={<Mail className="w-5 h-5" />}
                  />

                  <Input
                    label="Telefone"
                    type="tel"
                    value={personalData.phone}
                    onChange={(e) =>
                      setPersonalData({
                        ...personalData,
                        phone: e.target.value,
                      })
                    }
                    icon={<Phone className="w-5 h-5" />}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="CPF"
                    type="text"
                    value={personalData.cpf}
                    disabled
                    icon={<FileText className="w-5 h-5" />}
                  />

                  <Input
                    label="Data de Nascimento"
                    type="date"
                    value={personalData.birthDate}
                    onChange={(e) =>
                      setPersonalData({
                        ...personalData,
                        birthDate: e.target.value,
                      })
                    }
                    icon={<Calendar className="w-5 h-5" />}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sexo
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="M"
                        checked={personalData.gender === 'M'}
                        onChange={(e) =>
                          setPersonalData({
                            ...personalData,
                            gender: e.target.value,
                          })
                        }
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        Masculino
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="F"
                        checked={personalData.gender === 'F'}
                        onChange={(e) =>
                          setPersonalData({
                            ...personalData,
                            gender: e.target.value,
                          })
                        }
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        Feminino
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="O"
                        checked={personalData.gender === 'O'}
                        onChange={(e) =>
                          setPersonalData({
                            ...personalData,
                            gender: e.target.value,
                          })
                        }
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        Outro
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === 'address' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="CEP"
                    type="text"
                    value={addressData.zipCode}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        zipCode: e.target.value,
                      })
                    }
                    icon={<MapPin className="w-5 h-5" />}
                  />

                  <div className="md:col-span-2">
                    <Input
                      label="Rua"
                      type="text"
                      value={addressData.street}
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          street: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Número"
                    type="text"
                    value={addressData.number}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        number: e.target.value,
                      })
                    }
                  />

                  <Input
                    label="Complemento"
                    type="text"
                    value={addressData.complement}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        complement: e.target.value,
                      })
                    }
                  />
                </div>

                <Input
                  label="Bairro"
                  type="text"
                  value={addressData.neighborhood}
                  onChange={(e) =>
                    setAddressData({
                      ...addressData,
                      neighborhood: e.target.value,
                    })
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Cidade"
                      type="text"
                      value={addressData.city}
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          city: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Estado
                    </label>
                    <select
                      value={addressData.state}
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          state: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="SP">SP</option>
                      <option value="RJ">RJ</option>
                      <option value="MG">MG</option>
                      <option value="RS">RS</option>
                      {/* Add more states as needed */}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-6">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Dica:</strong> Use uma senha forte com pelo menos 8
                    caracteres, incluindo letras maiúsculas, minúsculas,
                    números e símbolos.
                  </p>
                </div>

                <Input
                  label="Senha Atual"
                  type="password"
                  value={securityData.currentPassword}
                  onChange={(e) =>
                    setSecurityData({
                      ...securityData,
                      currentPassword: e.target.value,
                    })
                  }
                  icon={<Lock className="w-5 h-5" />}
                />

                <Input
                  label="Nova Senha"
                  type="password"
                  value={securityData.newPassword}
                  onChange={(e) =>
                    setSecurityData({
                      ...securityData,
                      newPassword: e.target.value,
                    })
                  }
                  icon={<Lock className="w-5 h-5" />}
                />

                <Input
                  label="Confirmar Nova Senha"
                  type="password"
                  value={securityData.confirmPassword}
                  onChange={(e) =>
                    setSecurityData({
                      ...securityData,
                      confirmPassword: e.target.value,
                    })
                  }
                  icon={<Lock className="w-5 h-5" />}
                  error={
                    securityData.confirmPassword &&
                    securityData.newPassword !== securityData.confirmPassword
                      ? 'As senhas não coincidem'
                      : undefined
                  }
                />
              </div>
            )}

            {/* Save Button */}
            <div className="flex items-center justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button variant="primary" size="lg" onClick={handleSave}>
                <Save className="w-5 h-5 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
