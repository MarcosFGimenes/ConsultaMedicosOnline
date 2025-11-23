'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  AlertCircle,
  XCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { auth } from '@/lib/firebase';

type CancellationStep = 'initial' | 'reasons' | 'retention' | 'confirmation';

const CANCELLATION_REASONS = [
  'Preço muito alto',
  'Não estou usando o serviço',
  'Encontrei uma alternativa melhor',
  'Atendimento insatisfatório',
  'Dificuldade de agendamento',
  'Mudança de plano de saúde',
  'Outro motivo',
];

interface PlanoInfo {
  nome: string;
  valor: number;
  dependentes: number;
}

export default function CancelarPlanoPage() {
  const [step, setStep] = useState<CancellationStep>('initial');
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [additionalComments, setAdditionalComments] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
  const [cancelError, setCancelError] = useState<string>('');
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [loadingPlano, setLoadingPlano] = useState(true);
  const [planoInfo, setPlanoInfo] = useState<PlanoInfo | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [dataCancelamento, setDataCancelamento] = useState<string | null>(null);

  // Carregar informações do plano
  useEffect(() => {
    const carregarPlano = async () => {
      try {
        setLoadingPlano(true);
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        if (!token) {
          setError('Usuário não autenticado');
          setLoadingPlano(false);
          return;
        }

        const response = await fetch(`${apiBase}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar informações do plano');
        }

        const data = await response.json();
        
        // Buscar informações do plano a partir dos dados do dashboard
        const assinatura = data.assinaturas?.[0] || data.usuario;
        const beneficiarios = data.beneficiarios || [];
        
        if (assinatura?.planoId) {
          // Buscar detalhes do plano
          const planosResponse = await fetch(`${apiBase}/planos`);
          if (planosResponse.ok) {
            const planos = await planosResponse.json();
            const plano = Array.isArray(planos) 
              ? planos.find((p: any) => p.id === assinatura.planoId)
              : null;
            
            if (plano) {
              setPlanoInfo({
                nome: plano.tipo || plano.nome || 'Plano',
                valor: plano.preco || plano.valor || 0,
                dependentes: beneficiarios.length || 0
              });
            }
          }
        } else if (assinatura?.plano) {
          // Se o plano já vem nos dados da assinatura
          setPlanoInfo({
            nome: assinatura.plano.tipo || assinatura.plano.nome || 'Plano',
            valor: assinatura.plano.preco || assinatura.plano.valor || 0,
            dependentes: beneficiarios.length || 0
          });
        }
      } catch (err: any) {
        console.error('Erro ao carregar plano:', err);
        setError(err.message || 'Erro ao carregar informações do plano');
      } finally {
        setLoadingPlano(false);
      }
    };

    carregarPlano();
  }, []);

  // Corrigido: handleReasonToggle estava com escopo e lógica quebrados
  const handleReasonToggle = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter(r => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  // Corrigido: handleConfirmCancellation duplicado e escopo errado
  const handleConfirmCancellation = async () => {
    console.log('[CancelarPlano] Iniciando cancelamento...');
    setCancelError('');
    setError('');
    setLoadingCancel(true);
    setLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        console.error('[CancelarPlano] Token não encontrado');
        throw new Error('Usuário não autenticado');
      }
      
      console.log('[CancelarPlano] Verificando faturas...');
      // Verifica pagamento em dia
      const resp = await fetch(`${apiBase}/faturas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        console.error('[CancelarPlano] Erro ao consultar faturas:', errorData);
        throw new Error(errorData.error || 'Erro ao consultar faturas');
      }
      
      const data = await resp.json();
      console.log('[CancelarPlano] Dados das faturas:', data);
      const faturas = data?.faturas || [];
      const emDia = Array.isArray(faturas)
        ? faturas.some((f: any) => f.status === 'RECEIVED' || f.status === 'PAID')
        : false;
      
      console.log('[CancelarPlano] Pagamento em dia:', emDia);
      
      if (!emDia) {
        console.warn('[CancelarPlano] Pagamento não está em dia');
        const mensagemErro = 'Não é possível cancelar: pagamento não está em dia. Regularize sua situação para prosseguir.';
        setCancelError(mensagemErro);
        setError(mensagemErro);
        setLoadingCancel(false);
        setLoading(false);
        return;
      }
      
      console.log('[CancelarPlano] Chamando API de cancelamento...');
      // Chamada à API de cancelamento
      const cancelResponse = await fetch(`${apiBase}/subscription/cancelar-plano`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reasons: selectedReasons,
          comments: additionalComments
        })
      });
      
      console.log('[CancelarPlano] Resposta do cancelamento:', cancelResponse.status, cancelResponse.statusText);
      
      if (!cancelResponse.ok) {
        const errorData = await cancelResponse.json().catch(() => ({}));
        console.error('[CancelarPlano] Erro na resposta:', errorData);
        throw new Error(errorData.error || 'Erro ao cancelar plano');
      }
      
      const result = await cancelResponse.json();
      console.log('[CancelarPlano] Cancelamento bem-sucedido:', result);
      setDataCancelamento(result.dataCancelamento || new Date().toISOString());
      setStep('confirmation');
    } catch (e: any) {
      console.error('[CancelarPlano] Erro ao cancelar plano:', e);
      console.error('[CancelarPlano] Stack:', e.stack);
      const errorMessage = e.message || 'Erro ao cancelar plano';
      setCancelError(errorMessage);
      setError(errorMessage);
    } finally {
      console.log('[CancelarPlano] Finalizando (loading: false)');
      setLoadingCancel(false);
      setLoading(false);
    }
  };

  const handleAcceptOffer = () => {
    // Aqui faria a chamada à API para aceitar oferta
    // Exemplo: setStep('confirmation');
    setStep('confirmation');
  };

  return (
    <DashboardLayout title="Cancelar Plano">
      <div className="max-w-4xl mx-auto">
        {/* Initial Warning */}
        {step === 'initial' && (
          <>
            <Card className="mb-6 border-2 border-yellow-400 dark:border-yellow-600">
              <CardBody>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-warning" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Antes de cancelar, considere:
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                        Você perderá acesso imediato a consultas com especialistas
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                        Seu histórico médico ficará inacessível
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                        Dependentes cadastrados serão removidos
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                        Consultas agendadas serão canceladas automaticamente
                      </li>
                    </ul>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>Seu Plano Atual</CardHeader>
              <CardBody>
                {loadingPlano ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Carregando informações do plano...</p>
                  </div>
                ) : planoInfo ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Plano
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {planoInfo.nome}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Valor Mensal
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        R$ {planoInfo.valor.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Dependentes
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {planoInfo.dependentes} {planoInfo.dependentes === 1 ? 'ativo' : 'ativos'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">Não foi possível carregar as informações do plano.</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="outline" onClick={() => window.history.back()}>
                    Voltar ao Dashboard
                  </Button>
                  <Button variant="danger" onClick={() => setStep('reasons')}>
                    <XCircle className="w-5 h-5 mr-2" />
                    Continuar com Cancelamento
                  </Button>
                </div>
              </CardBody>
            </Card>
          </>
        )}

        {/* Cancellation Reasons */}
        {step === 'reasons' && (
          <Card>
            <CardHeader>Por que você quer cancelar?</CardHeader>
            <CardBody>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Selecione um ou mais motivos (opcional)
              </p>

              <div className="space-y-3 mb-6">
                {CANCELLATION_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedReasons.includes(reason)}
                      onChange={() => handleReasonToggle(reason)}
                      className="w-5 h-5 text-primary focus:ring-primary rounded"
                    />
                    <span className="ml-3 text-gray-900 dark:text-white">
                      {reason}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comentários Adicionais (opcional)
                </label>
                <textarea
                  value={additionalComments}
                  onChange={(e) => setAdditionalComments(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Conte-nos mais sobre sua decisão..."
                />
              </div>

              {(error || cancelError) && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800 dark:text-red-300">{error || cancelError}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" onClick={() => setStep('initial')}>
                  Voltar
                </Button>
                <Button 
                  type="button"
                  variant="danger" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[CancelarPlano] Botão clicado');
                    handleConfirmCancellation();
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Cancelando...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 mr-2" />
                      Confirmar Cancelamento
                    </>
                  )}
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Retention Offers */}
        {step === 'retention' && (
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <Button
                    variant="outline"
                    onClick={() => setStep('reasons')}
                  >
                    Voltar
                  </Button>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="danger" onClick={handleConfirmCancellation} disabled={loadingCancel}>
                    {loadingCancel ? 'Cancelando...' : 'Cancelar Mesmo Assim'}
                  </Button>
                </div>
              </div>
              {(error || cancelError) && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800 dark:text-red-300">{error || cancelError}</p>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {/* Confirmation */}
        {step === 'confirmation' && (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-10 h-10 text-danger" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Plano Cancelado
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Seu plano foi cancelado com sucesso.
                </p>
                {dataCancelamento && (
                  <p className="text-sm text-gray-500 mb-8">
                    Seu plano foi cancelado em{' '}
                    <strong>{new Date(dataCancelamento).toLocaleDateString('pt-BR')}</strong>
                  </p>
                )}

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl mb-8">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Sentiremos sua falta!</strong> Você pode reativar
                    sua assinatura a qualquer momento. Seus dados ficarão
                    salvos por 90 dias.
                  </p>
                </div>

                <Button variant="primary" onClick={() => window.location.href = '/'}>
                  Ir para Página Inicial
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}