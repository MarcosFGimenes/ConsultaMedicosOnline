'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Settings,
  Save,
  Key,
  Mail,
  Bell,
  Shield,
  Database,
  Globe,
  CreditCard,
  Webhook,
} from 'lucide-react';
import { useState } from 'react';

export default function AdminConfiguracoesPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <DashboardLayout title="Configurações do Sistema">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Configurações Gerais
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure as integrações e parâmetros do sistema
        </p>
      </div>

      <div className="space-y-6">
        {/* Configurações de Email */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-primary mr-2" />
              Configurações de Email (SMTP)
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Servidor SMTP"
                type="text"
                defaultValue="smtp.gmail.com"
                placeholder="smtp.exemplo.com"
              />
              <Input
                label="Porta"
                type="number"
                defaultValue="587"
                placeholder="587"
              />
              <Input
                label="Usuário SMTP"
                type="email"
                defaultValue="noreply@medicosconsultas.com"
                placeholder="usuario@exemplo.com"
              />
              <Input
                label="Senha SMTP"
                type="password"
                placeholder="••••••••"
              />
              <div className="md:col-span-2">
                <Input
                  label="Email de Remetente"
                  type="email"
                  defaultValue="noreply@medicosconsultas.com"
                  placeholder="noreply@exemplo.com"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline">Testar Conexão</Button>
              <Button variant="primary" onClick={handleSave} isLoading={saving}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Configurações do Asaas (Gateway de Pagamento) */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 text-primary mr-2" />
              Integração Asaas (Gateway de Pagamento)
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="API Key (Produção)"
                type="password"
                placeholder="$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzPTNDNhZmQ6OjAwMDAwMDAwMDAwMDA"
                icon={<Key className="w-5 h-5" />}
              />
              <Input
                label="API Key (Sandbox/Teste)"
                type="password"
                placeholder="$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzPTNDNhZmQ6OjAwMDAwMDAwMDAwMDA"
                icon={<Key className="w-5 h-5" />}
              />
              <Input
                label="Webhook URL"
                type="url"
                defaultValue="https://medicosconsultas.com/webhooks/asaas"
                placeholder="https://seusite.com/webhooks/asaas"
                icon={<Webhook className="w-5 h-5" />}
              />
              <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <input type="checkbox" id="sandbox" className="w-4 h-4" />
                <label htmlFor="sandbox" className="text-sm text-gray-700 dark:text-gray-300">
                  Usar modo Sandbox (ambiente de testes)
                </label>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline">Testar Conexão</Button>
              <Button variant="primary" onClick={handleSave} isLoading={saving}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Configurações do Firebase */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Database className="w-5 h-5 text-primary mr-2" />
              Integração Firebase
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="API Key"
                type="password"
                placeholder="AIzaSyD..."
                icon={<Key className="w-5 h-5" />}
              />
              <Input
                label="Auth Domain"
                type="text"
                defaultValue="medicosconsultas-app.firebaseapp.com"
                placeholder="seu-projeto.firebaseapp.com"
              />
              <Input
                label="Project ID"
                type="text"
                defaultValue="medicosconsultas-app"
                placeholder="seu-projeto-id"
              />
              <Input
                label="Storage Bucket"
                type="text"
                defaultValue="medicosconsultas-app.appspot.com"
                placeholder="seu-projeto.appspot.com"
              />
              <Input
                label="Messaging Sender ID"
                type="text"
                placeholder="123456789012"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="primary" onClick={handleSave} isLoading={saving}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Configurações da Rapidoc API */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Globe className="w-5 h-5 text-primary mr-2" />
              Integração Rapidoc API
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="API Key"
                type="password"
                placeholder="rapidoc_key_..."
                icon={<Key className="w-5 h-5" />}
              />
              <Input
                label="Base URL"
                type="url"
                defaultValue="https://api.rapidoc.com.br/v1"
                placeholder="https://api.rapidoc.com.br/v1"
              />
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Recursos Habilitados:</strong>
                </p>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm">Validação de CPF</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm">Consulta de CEP</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">Verificação de documentos</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="primary" onClick={handleSave} isLoading={saving}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Configurações de Segurança */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-primary mr-2" />
              Segurança do Sistema
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Autenticação de dois fatores (2FA)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Exigir 2FA para administradores
                  </p>
                </div>
                <input type="checkbox" className="w-12 h-6" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Log de auditoria
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Registrar todas as ações administrativas
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="w-12 h-6" />
              </div>

              <Input
                label="Tempo máximo de sessão (minutos)"
                type="number"
                defaultValue="60"
                placeholder="60"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="primary" onClick={handleSave} isLoading={saving}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Configurações de Notificações */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-primary mr-2" />
              Notificações do Sistema
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm">Notificar sobre novos assinantes</span>
              </label>
              <label className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm">Notificar sobre cancelamentos</span>
              </label>
              <label className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm">Notificar sobre erros críticos</span>
              </label>
              <label className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">Notificar sobre pagamentos pendentes</span>
              </label>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="primary" onClick={handleSave} isLoading={saving}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
