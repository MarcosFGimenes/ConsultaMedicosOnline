'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  FileText,
  Search,
  Filter,
  AlertTriangle,
  XCircle,
  Info,
  CheckCircle,
  Clock,
  Download,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [logs] = useState([
    {
      id: 1,
      tipo: 'error',
      nivel: 'Crítico',
      mensagem: 'Falha na integração de pagamento - Gateway Asaas retornou timeout',
      timestamp: '2025-11-06 14:32:15',
      endpoint: '/api/payments/process',
      usuario: 'Sistema',
      detalhes: 'Connection timeout after 30s',
      stackTrace: 'Error: ETIMEDOUT at...',
    },
    {
      id: 2,
      tipo: 'warning',
      nivel: 'Alerta',
      mensagem: 'Taxa de erro elevada no endpoint de consultas (15% nos últimos 5min)',
      timestamp: '2025-11-06 13:15:42',
      endpoint: '/api/appointments/create',
      usuario: 'Sistema',
      detalhes: '45 falhas de 300 requisições',
      stackTrace: null,
    },
    {
      id: 3,
      tipo: 'info',
      nivel: 'Info',
      mensagem: 'Backup automático concluído com sucesso',
      timestamp: '2025-11-06 12:00:00',
      endpoint: '/system/backup',
      usuario: 'Cron Job',
      detalhes: 'Database: 2.5GB, Files: 500MB',
      stackTrace: null,
    },
    {
      id: 4,
      tipo: 'error',
      nivel: 'Crítico',
      mensagem: 'Falha ao enviar email de confirmação',
      timestamp: '2025-11-06 11:45:23',
      endpoint: '/api/notifications/email',
      usuario: 'joao.silva@email.com',
      detalhes: 'SMTP connection refused',
      stackTrace: 'Error: Connection refused at...',
    },
    {
      id: 5,
      tipo: 'warning',
      nivel: 'Alerta',
      mensagem: 'Limite de requisições API próximo do limite (85%)',
      timestamp: '2025-11-06 10:30:11',
      endpoint: '/api/*',
      usuario: 'Sistema',
      detalhes: '8500 de 10000 requisições/hora',
      stackTrace: null,
    },
    {
      id: 6,
      tipo: 'error',
      nivel: 'Crítico',
      mensagem: 'Erro ao processar webhook do Asaas',
      timestamp: '2025-11-06 09:22:05',
      endpoint: '/webhooks/asaas',
      usuario: 'Asaas Gateway',
      detalhes: 'Invalid signature',
      stackTrace: 'ValidationError: Invalid signature...',
    },
    {
      id: 7,
      tipo: 'info',
      nivel: 'Info',
      mensagem: 'Usuário admin fez login no sistema',
      timestamp: '2025-11-06 08:00:33',
      endpoint: '/api/auth/login',
      usuario: 'admin@sistema.com',
      detalhes: 'IP: 192.168.1.100',
      stackTrace: null,
    },
    {
      id: 8,
      tipo: 'warning',
      nivel: 'Alerta',
      mensagem: 'Múltiplas tentativas de login falhadas',
      timestamp: '2025-11-06 07:45:12',
      endpoint: '/api/auth/login',
      usuario: 'unknown@test.com',
      detalhes: '5 tentativas em 2 minutos',
      stackTrace: null,
    },
  ]);

  const filteredLogs = logs.filter(log => 
    log.mensagem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLogIcon = (tipo: string) => {
    switch (tipo) {
      case 'error':
        return <XCircle className="w-5 h-5 text-danger" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'info':
        return <Info className="w-5 h-5 text-info" />;
      default:
        return <CheckCircle className="w-5 h-5 text-success" />;
    }
  };

  const getLogBadge = (nivel: string) => {
    switch (nivel) {
      case 'Crítico':
        return <Badge variant="danger">Crítico</Badge>;
      case 'Alerta':
        return <Badge variant="warning">Alerta</Badge>;
      case 'Info':
        return <Badge variant="info">Info</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <DashboardLayout title="Logs de Erro">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Logs do Sistema
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitore erros e eventos do sistema
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-5 h-5 mr-2" />
            Exportar
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-5 h-5 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total de Logs
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {logs.length}
                </p>
              </div>
              <FileText className="w-10 h-10 text-primary opacity-20" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Críticos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {logs.filter(l => l.nivel === 'Crítico').length}
                </p>
              </div>
              <XCircle className="w-10 h-10 text-danger opacity-20" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Alertas
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {logs.filter(l => l.nivel === 'Alerta').length}
                </p>
              </div>
              <AlertTriangle className="w-10 h-10 text-warning opacity-20" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Info
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {logs.filter(l => l.nivel === 'Info').length}
                </p>
              </div>
              <Info className="w-10 h-10 text-info opacity-20" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Buscar logs por mensagem, endpoint ou usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-5 h-5 mr-2" />
              Filtros
            </Button>
            <Button variant="danger">
              <Trash2 className="w-5 h-5 mr-2" />
              Limpar Logs
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Lista de Logs */}
      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <Card key={log.id} className="hover:shadow-md transition-shadow">
            <CardBody>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getLogIcon(log.tipo)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    {getLogBadge(log.nivel)}
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {log.timestamp}
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    {log.mensagem}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                    <div>
                      <span className="font-medium">Endpoint:</span> {log.endpoint}
                    </div>
                    <div>
                      <span className="font-medium">Usuário:</span> {log.usuario}
                    </div>
                    <div>
                      <span className="font-medium">Detalhes:</span> {log.detalhes}
                    </div>
                  </div>

                  {log.stackTrace && (
                    <details className="mt-2">
                      <summary className="text-xs text-primary cursor-pointer hover:underline">
                        Ver Stack Trace
                      </summary>
                      <pre className="mt-2 p-3 bg-gray-900 dark:bg-black text-gray-100 text-xs rounded-lg overflow-x-auto">
                        {log.stackTrace}
                      </pre>
                    </details>
                  )}
                </div>

                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}

        {filteredLogs.length === 0 && (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Nenhum log encontrado
                </p>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
