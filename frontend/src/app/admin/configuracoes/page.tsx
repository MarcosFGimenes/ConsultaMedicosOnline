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
      </div>
    </DashboardLayout>
  );
}
