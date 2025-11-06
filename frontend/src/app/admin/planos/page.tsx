'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function AdminPlanosPage() {
  const [planos] = useState([
    {
      id: 1,
      nome: 'Básico Individual',
      descricao: 'Plano individual com consultas básicas',
      valor: 49.90,
      assinantes: 450,
      status: 'ativo',
      beneficios: ['Clínico Geral', 'Pediatria', '5 consultas/mês'],
      tipo: 'individual',
    },
    {
      id: 2,
      nome: 'Premium Individual',
      descricao: 'Plano individual com todas as especialidades',
      valor: 89.90,
      assinantes: 320,
      status: 'ativo',
      beneficios: ['Todas as especialidades', 'Consultas ilimitadas', 'Atendimento prioritário'],
      tipo: 'individual',
    },
    {
      id: 3,
      nome: 'Básico Familiar',
      descricao: 'Plano familiar para até 4 dependentes',
      valor: 149.90,
      assinantes: 280,
      status: 'ativo',
      beneficios: ['Até 4 dependentes', 'Clínico Geral', 'Pediatria', '10 consultas/mês'],
      tipo: 'familiar',
    },
    {
      id: 4,
      nome: 'Premium Familiar',
      descricao: 'Plano familiar completo para até 6 dependentes',
      valor: 249.90,
      assinantes: 198,
      status: 'ativo',
      beneficios: ['Até 6 dependentes', 'Todas as especialidades', 'Consultas ilimitadas', 'Atendimento 24h'],
      tipo: 'familiar',
    },
    {
      id: 5,
      nome: 'Empresarial',
      descricao: 'Plano para empresas (descontinuado)',
      valor: 399.90,
      assinantes: 12,
      status: 'inativo',
      beneficios: ['Até 20 funcionários', 'Gestão empresarial'],
      tipo: 'empresarial',
    },
  ]);

  return (
    <DashboardLayout title="Gerenciar Planos">
      {/* Header com ação */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Planos Cadastrados
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie os planos de telemedicina oferecidos
          </p>
        </div>
        <Link href="/admin/planos/novo">
          <Button variant="primary" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Novo Plano
          </Button>
        </Link>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total de Planos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {planos.length}
                </p>
              </div>
              <Package className="w-10 h-10 text-primary opacity-20" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Planos Ativos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {planos.filter(p => p.status === 'ativo').length}
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
                  Total Assinantes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {planos.reduce((acc, p) => acc + p.assinantes, 0)}
                </p>
              </div>
              <Users className="w-10 h-10 text-primary opacity-20" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Receita Estimada
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  R$ {(planos.reduce((acc, p) => acc + (p.valor * p.assinantes), 0) / 1000).toFixed(0)}k
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-success opacity-20" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Lista de Planos */}
      <div className="space-y-4">
        {planos.map((plano) => (
          <Card key={plano.id} className="hover:shadow-lg transition-shadow">
            <CardBody>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-8 h-8 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {plano.nome}
                      </h3>
                      {plano.status === 'ativo' ? (
                        <Badge variant="success">Ativo</Badge>
                      ) : (
                        <Badge variant="danger">Inativo</Badge>
                      )}
                      <Badge variant="info">
                        {plano.tipo.charAt(0).toUpperCase() + plano.tipo.slice(1)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {plano.descricao}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {plano.beneficios.map((beneficio, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-700 dark:text-gray-300"
                        >
                          {beneficio}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{plano.assinantes} assinantes</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>Receita: R$ {(plano.valor * plano.assinantes).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-3 ml-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Valor mensal</p>
                    <p className="text-2xl font-bold text-primary">
                      R$ {plano.valor.toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="danger" size="sm">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
