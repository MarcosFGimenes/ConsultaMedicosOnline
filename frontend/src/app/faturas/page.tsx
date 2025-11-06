'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Eye,
} from 'lucide-react';

type InvoiceStatus = 'paid' | 'pending' | 'overdue';

interface Invoice {
  id: number;
  referenceMonth: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  paymentDate?: string;
  paymentMethod?: string;
}

const MOCK_INVOICES: Invoice[] = [
  {
    id: 6,
    referenceMonth: '2025-12',
    dueDate: '2025-12-15',
    amount: 149.9,
    status: 'pending',
  },
  {
    id: 5,
    referenceMonth: '2025-11',
    dueDate: '2025-11-15',
    amount: 149.9,
    status: 'paid',
    paymentDate: '2025-11-12',
    paymentMethod: 'Cartão de Crédito',
  },
  {
    id: 4,
    referenceMonth: '2025-10',
    dueDate: '2025-10-15',
    amount: 149.9,
    status: 'paid',
    paymentDate: '2025-10-14',
    paymentMethod: 'PIX',
  },
  {
    id: 3,
    referenceMonth: '2025-09',
    dueDate: '2025-09-15',
    amount: 149.9,
    status: 'paid',
    paymentDate: '2025-09-10',
    paymentMethod: 'Boleto',
  },
  {
    id: 2,
    referenceMonth: '2025-08',
    dueDate: '2025-08-15',
    amount: 149.9,
    status: 'paid',
    paymentDate: '2025-08-13',
    paymentMethod: 'Cartão de Crédito',
  },
];

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; variant: 'success' | 'warning' | 'danger'; icon: any }
> = {
  paid: {
    label: 'Paga',
    variant: 'success',
    icon: CheckCircle,
  },
  pending: {
    label: 'Pendente',
    variant: 'warning',
    icon: Clock,
  },
  overdue: {
    label: 'Vencida',
    variant: 'danger',
    icon: XCircle,
  },
};

export default function FaturasPage() {
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatMonthYear = (dateString: string) => {
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });
  };

  const totalPaid = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalPending = invoices
    .filter((inv) => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <DashboardLayout title="Faturas">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardBody>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Pago
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(totalPaid)}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pendente
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(totalPending)}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total de Faturas
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {invoices.length}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Invoices Table (Desktop) */}
      <Card className="hidden md:block">
        <CardHeader>Histórico de Faturas</CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Referência
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Vencimento
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Valor
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Pagamento
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => {
                  const statusConfig = STATUS_CONFIG[invoice.status];
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr
                      key={invoice.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                          {formatMonthYear(invoice.referenceMonth)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(
                            invoice.dueDate + 'T00:00:00'
                          ).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(invoice.amount)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={statusConfig.variant}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        {invoice.paymentDate ? (
                          <div className="text-sm">
                            <p className="text-gray-900 dark:text-white">
                              {new Date(
                                invoice.paymentDate + 'T00:00:00'
                              ).toLocaleDateString('pt-BR')}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {invoice.paymentMethod}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          {invoice.status === 'pending' && (
                            <Button variant="primary" size="sm">
                              Pagar
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Invoices Cards (Mobile) */}
      <div className="md:hidden space-y-4">
        {invoices.map((invoice) => {
          const statusConfig = STATUS_CONFIG[invoice.status];
          const StatusIcon = statusConfig.icon;

          return (
            <Card key={invoice.id}>
              <CardBody>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                        {formatMonthYear(invoice.referenceMonth)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Fatura #{invoice.id}
                      </p>
                    </div>
                    <Badge variant={statusConfig.variant}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Vencimento
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(
                          invoice.dueDate + 'T00:00:00'
                        ).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Valor
                      </span>
                      <span className="font-semibold text-lg text-gray-900 dark:text-white">
                        {formatCurrency(invoice.amount)}
                      </span>
                    </div>
                    {invoice.paymentDate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Pago em
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(
                            invoice.paymentDate + 'T00:00:00'
                          ).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar
                    </Button>
                    {invoice.status === 'pending' && (
                      <Button variant="primary" size="sm" className="flex-1">
                        Pagar
                      </Button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
