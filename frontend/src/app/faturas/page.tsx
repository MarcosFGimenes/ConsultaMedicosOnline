'use client';

type InvoiceStatus = 'paid' | 'pending' | 'overdue';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useEffect, useState } from 'react';
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

type FaturaApi = {
  id: string;
  status: string;
  value: number;
  dueDate: string;
  paymentDate?: string | null;
  billingType?: string;
  bankSlipUrl?: string;
  invoiceUrl?: string;
  description?: string;
};

interface Invoice {
  id: string;
  referenceMonth: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  paymentDate?: string | null;
  paymentMethod?: string;
  bankSlipUrl?: string;
  invoiceUrl?: string;
  description?: string;
}

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
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    fetch(`${apiBase}/dashboard`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((json) => {
        const faturas: FaturaApi[] = json.faturas || [];
        const invoicesMapped: Invoice[] = faturas.map((f) => {
          let status: InvoiceStatus = 'pending';
          if (f.status === 'RECEIVED') status = 'paid';
          else if (f.status === 'OVERDUE') status = 'overdue';
          else if (f.status === 'PENDING') status = 'pending';
          let referenceMonth = '';
          if (f.dueDate) {
            const [ano, mes] = f.dueDate.split('-');
            referenceMonth = `${ano}-${mes}`;
          }
          return {
            id: f.id,
            referenceMonth,
            dueDate: f.dueDate,
            amount: f.value,
            status,
            paymentDate: f.paymentDate,
            paymentMethod: f.billingType,
            bankSlipUrl: f.bankSlipUrl,
            invoiceUrl: f.invoiceUrl,
            description: f.description,
          };
        });
        setInvoices(invoicesMapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
    .filter((inv: Invoice) => inv.status === 'paid')
    .reduce((sum: number, inv: Invoice) => sum + inv.amount, 0);

  const totalPending = invoices
    .filter((inv: Invoice) => inv.status === 'pending')
    .reduce((sum: number, inv: Invoice) => sum + inv.amount, 0);

  function PaymentModal({ invoice, onClose }: { invoice: Invoice | null; onClose: () => void }) {
    if (!invoice) return null;

    const isPix = invoice.paymentMethod?.toLowerCase().includes('pix');
    const isBoleto = invoice.paymentMethod?.toLowerCase().includes('boleto');
    const isCartao = invoice.paymentMethod?.toLowerCase().includes('cartao') || invoice.paymentMethod?.toLowerCase().includes('crédito');

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-md w-full p-6 relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
          <h2 className="text-lg font-bold mb-4">Pagamento da Fatura</h2>
          <div className="mb-4">
            <div className="text-gray-700 dark:text-gray-200 font-medium mb-2">
              Valor: <span className="font-bold">{invoice.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              Vencimento: {new Date(invoice.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')}
            </div>
          </div>
          {isPix && (
            <div className="mb-4">
              <div className="font-semibold mb-2">Pagamento via PIX</div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 mb-2 text-xs break-all select-all">
                {invoice.description || 'Chave/código PIX indisponível'}
              </div>
            </div>
          )}
          {isBoleto && (
            <div className="mb-4">
              <div className="font-semibold mb-2">Pagamento via Boleto</div>
              {invoice.bankSlipUrl ? (
                <a
                  href={invoice.bankSlipUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Baixar Boleto
                </a>
              ) : (
                <div className="text-sm text-gray-500">Boleto indisponível</div>
              )}
            </div>
          )}
          {isCartao && (
            <div className="mb-4">
              <div className="font-semibold mb-2">Pagamento via Cartão</div>
              <div className="text-sm text-gray-500">Entre em contato com o suporte ou acesse o link de pagamento do cartão (se disponível).</div>
            </div>
          )}
          {!isPix && !isBoleto && !isCartao && (
            <div className="mb-4 text-sm text-gray-500">Forma de pagamento não reconhecida.</div>
          )}
          <button
            className="mt-2 w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <DashboardLayout title="Faturas">
        <div className="py-20 text-center text-gray-500">Carregando...</div>
      </DashboardLayout>
    );
  }

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
                          {invoice.referenceMonth ? formatMonthYear(invoice.referenceMonth) : '-'}
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
                          {invoice.invoiceUrl && (
                            <a
                              href={invoice.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-transparent hover:bg-accent hover:text-accent-foreground h-9 px-2 py-1 text-gray-700 dark:text-gray-300"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                          )}
                          {invoice.bankSlipUrl && (
                            <a
                              href={invoice.bankSlipUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-transparent hover:bg-accent hover:text-accent-foreground h-9 px-2 py-1 text-gray-700 dark:text-gray-300"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                          {invoice.status === 'pending' && (
                            <Button variant="primary" size="sm" onClick={() => setSelectedInvoice(invoice)}>
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
                        {invoice.referenceMonth ? formatMonthYear(invoice.referenceMonth) : '-'}
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
                    {invoice.invoiceUrl && (
                      <a
                        href={invoice.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 text-gray-700 dark:text-gray-300"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver
                      </a>
                    )}
                    {invoice.bankSlipUrl && (
                      <a
                        href={invoice.bankSlipUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 text-gray-700 dark:text-gray-300"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar
                      </a>
                    )}
                    {invoice.status === 'pending' && (
                      <Button variant="primary" size="sm" className="flex-1" onClick={() => setSelectedInvoice(invoice)}>
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
      {selectedInvoice && (
        <PaymentModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}
    </DashboardLayout>
  );
}