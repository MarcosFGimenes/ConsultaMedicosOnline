'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Stethoscope, User, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  // Simula um token de desenvolvimento
  const handleDevLogin = () => {
    // Salva um token fake no localStorage para simular autenticação
    localStorage.setItem('token', 'dev-token-123');
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      name: 'Gustavo Silva Santos',
      email: 'gustavo@email.com',
      role: 'patient'
    }));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Consultas Online
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sistema de Telemedicina
          </p>
        </div>

        <Card>
          <CardHeader>Acesso ao Sistema</CardHeader>
          <CardBody>
            <div className="space-y-4">
              {/* Dev Access */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Lock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                      Modo Desenvolvimento
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400">
                      Login temporário enquanto o sistema de autenticação não está completo
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleDevLogin}
              >
                <User className="w-5 h-5 mr-2" />
                Entrar como Paciente (Dev)
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                    ou
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => router.push('/login')}
              >
                Ir para Login Real
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => router.push('/primeiro-acesso')}
              >
                Primeiro Acesso / Cadastro
              </Button>
            </div>

            {/* Quick Links */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-semibold">
                Acesso Rápido às Páginas:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-left text-primary hover:underline"
                >
                  • Dashboard
                </button>
                <button
                  onClick={() => router.push('/consultas/agendar')}
                  className="text-left text-primary hover:underline"
                >
                  • Agendar Consulta
                </button>
                <button
                  onClick={() => router.push('/consultas/historico')}
                  className="text-left text-primary hover:underline"
                >
                  • Histórico
                </button>
                <button
                  onClick={() => router.push('/consultas/imediato')}
                  className="text-left text-primary hover:underline"
                >
                  • Atend. Imediato
                </button>
                <button
                  onClick={() => router.push('/faturas')}
                  className="text-left text-primary hover:underline"
                >
                  • Faturas
                </button>
                <button
                  onClick={() => router.push('/meus-dados')}
                  className="text-left text-primary hover:underline"
                >
                  • Meus Dados
                </button>
                <button
                  onClick={() => router.push('/configuracoes')}
                  className="text-left text-primary hover:underline"
                >
                  • Configurações
                </button>
                <button
                  onClick={() => router.push('/cancelar-plano')}
                  className="text-left text-primary hover:underline"
                >
                  • Cancelar Plano
                </button>
              </div>
            </div>
          </CardBody>
        </Card>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          © 2025 Consultas Médicos Online. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
