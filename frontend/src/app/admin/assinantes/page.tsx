'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  Users,
  Search,
  Filter,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Calendar,
  CreditCard,
  UserPlus,
  Package,
} from 'lucide-react';
import { useState } from 'react';

export default function AdminAssinantesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [assinantes] = useState([
    {
      id: 1,
      nome: 'João Silva Santos',
      email: 'joao.silva@email.com',
      cpf: '123.456.789-00',
      plano: 'Premium Familiar',
      status: 'ativo',
      dataAdesao: '15/01/2024',
      ultimoPagamento: '05/11/2025',
      dependentes: 3,
      valorMensal: 249.90,
    },
    {
      id: 2,
      nome: 'Maria Santos Oliveira',
      email: 'maria.santos@email.com',
      cpf: '987.654.321-00',
      plano: 'Básico Individual',
      status: 'ativo',
      dataAdesao: '20/03/2024',
      ultimoPagamento: '03/11/2025',
      dependentes: 0,
      valorMensal: 49.90,
    },
    {
      id: 3,
      nome: 'Pedro Costa Lima',
      email: 'pedro.costa@email.com',
      cpf: '456.789.123-00',
      plano: 'Premium Individual',
      status: 'pendente',
      dataAdesao: '05/11/2025',
      ultimoPagamento: '-',
      dependentes: 0,
      valorMensal: 89.90,
    },
    {
      id: 4,
      nome: 'Ana Paula Ferreira',
      email: 'ana.ferreira@email.com',
      cpf: '321.654.987-00',
      plano: 'Básico Familiar',
      status: 'ativo',
      dataAdesao: '10/02/2024',
      ultimoPagamento: '01/11/2025',
      dependentes: 2,
      valorMensal: 149.90,
    },
    {
      id: 5,
      nome: 'Carlos Mendes Souza',
      email: 'carlos.mendes@email.com',
      cpf: '789.123.456-00',
      plano: 'Premium Familiar',
      status: 'suspenso',
      dataAdesao: '05/05/2024',
      ultimoPagamento: '10/09/2025',
      dependentes: 4,
      valorMensal: 249.90,
    },
  ]);

  const filteredAssinantes = assinantes.filter(a => 
    a.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.cpf.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="success">Ativo</Badge>;
      case 'pendente':
        return <Badge variant="warning">Pendente</Badge>;
      case 'suspenso':
        return <Badge variant="danger">Suspenso</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <DashboardLayout title="Gerenciar Assinantes">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Assinantes do Sistema
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visualize e gerencie todos os usuários assinantes
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Assinantes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {assinantes.length}
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
                  Ativos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {assinantes.filter(a => a.status === 'ativo').length}
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
                  Pendentes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {assinantes.filter(a => a.status === 'pendente').length}
                </p>
              </div>
              <XCircle className="w-10 h-10 text-warning opacity-20" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Suspensos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {assinantes.filter(a => a.status === 'suspenso').length}
                </p>
              </div>
              <Ban className="w-10 h-10 text-danger opacity-20" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Buscar por nome, email ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-5 h-5 mr-2" />
              Filtros
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Lista de Assinantes */}
      <div className="space-y-4">
        {filteredAssinantes.map((assinante) => (
          <Card key={assinante.id} className="hover:shadow-lg transition-shadow">
            <CardBody>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {assinante.nome}
                      </h3>
                      {getStatusBadge(assinante.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div>📧 {assinante.email}</div>
                      <div>🆔 {assinante.cpf}</div>
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        {assinante.plano}
                      </div>
                      <div className="flex items-center">
                        <UserPlus className="w-4 h-4 mr-1" />
                        {assinante.dependentes} dependentes
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-xs text-gray-500 dark:text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Adesão: {assinante.dataAdesao}
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="w-3 h-3 mr-1" />
                        Último pagamento: {assinante.ultimoPagamento}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-3 ml-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Valor mensal</p>
                    <p className="text-xl font-bold text-primary">
                      R$ {assinante.valorMensal.toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Detalhes
                    </Button>
                    {assinante.status === 'ativo' ? (
                      <Button variant="danger" size="sm">
                        <Ban className="w-4 h-4 mr-1" />
                        Suspender
                      </Button>
                    ) : (
                      <Button variant="primary" size="sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Ativar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}

        {filteredAssinantes.length === 0 && (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Nenhum assinante encontrado
                </p>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
