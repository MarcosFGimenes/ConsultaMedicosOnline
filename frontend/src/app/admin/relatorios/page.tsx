'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  TrendingUp,
  Download,
  Calendar,
  Users,
  DollarSign,
  Activity,
  FileText,
  BarChart3,
  PieChart,
} from 'lucide-react';

export default function AdminRelatoriosPage() {
  return (
    <DashboardLayout title="Relatórios">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Relatórios e Métricas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize estatísticas e exporte relatórios
          </p>
        </div>
        <Button variant="primary">
          <Download className="w-5 h-5 mr-2" />
          Exportar Todos
        </Button>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Receita Total
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  R$ 748.800
                </p>
                <p className="text-xs text-success mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% vs mês anterior
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-success opacity-20" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Novos Assinantes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  156
                </p>
                <p className="text-xs text-success mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% vs mês anterior
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
                  Consultas Realizadas
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  2.847
                </p>
                <p className="text-xs text-success mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15% vs mês anterior
                </p>
              </div>
              <Activity className="w-10 h-10 text-purple-600 opacity-20" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Taxa de Cancelamento
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  2.3%
                </p>
                <p className="text-xs text-success mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                  -0.5% vs mês anterior
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-danger opacity-20" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Relatórios Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Relatório Financeiro */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardBody>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Relatório Financeiro
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Receitas, despesas, inadimplência e projeções financeiras
                </p>
                <div className="flex items-center space-x-2">
                  <Button variant="primary" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-1" />
                    Excel
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Relatório de Assinantes */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardBody>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Relatório de Assinantes
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Dados demográficos, planos, taxa de retenção e churn
                </p>
                <div className="flex items-center space-x-2">
                  <Button variant="primary" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-1" />
                    Excel
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Relatório de Consultas */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardBody>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Relatório de Consultas
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Volume de atendimentos, especialidades mais procuradas e horários de pico
                </p>
                <div className="flex items-center space-x-2">
                  <Button variant="primary" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-1" />
                    Excel
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Relatório de Performance */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardBody>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-6 h-6 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Relatório de Performance
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  KPIs, métricas de crescimento e comparativos mensais
                </p>
                <div className="flex items-center space-x-2">
                  <Button variant="primary" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-1" />
                    Excel
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="mt-8">
        <Card>
          <CardHeader>Crescimento de Assinantes (Últimos 6 meses)</CardHeader>
          <CardBody>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Gráfico de crescimento será exibido aqui
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Integrar com biblioteca de gráficos (Chart.js, Recharts, etc.)
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>Distribuição por Plano</CardHeader>
          <CardBody>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="text-center">
                <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Gráfico de pizza será exibido aqui
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Receita Mensal</CardHeader>
          <CardBody>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Gráfico de linha será exibido aqui
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
