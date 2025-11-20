'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Bell,
  Mail,
  MessageSquare,
  Globe,
  Moon,
  Lock,
  Shield,
  Smartphone,
  CheckCircle,
} from 'lucide-react';

export default function ConfiguracoesPage() {
  return (
    <DashboardLayout title="Configurações">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Alterar Senha */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Lock className="w-5 h-5 mr-2 text-primary" />
              Alterar Senha
            </div>
          </CardHeader>
          <CardBody>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3 mb-4">
                <Lock className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="font-semibold text-green-900 dark:text-green-100 mb-1">
                    Alterar Senha
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                    Mantenha sua conta segura alterando sua senha regularmente
                  </p>
                </div>
              </div>
              <Button 
                variant="primary" 
                onClick={() => {
                  // Implementação futura: abrir modal ou redirecionar
                  alert('Funcionalidade de trocar senha será implementada aqui. Por enquanto, entre em contato com o suporte.');
                }}
                className="w-full sm:w-auto"
              >
                Trocar Senha Agora
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Exportar/Excluir Dados */}
        <Card>
          <CardHeader>Seus Dados</CardHeader>
          <CardBody>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Você pode exportar ou excluir seus dados a qualquer momento
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Button variant="outline" className="flex-1">
                Exportar Meus Dados
              </Button>
              <Button variant="danger" className="flex-1">
                Excluir Minha Conta
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
