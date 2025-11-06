'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Mail, Lock, User, Stethoscope, CreditCard } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import InputMask from 'react-input-mask';

const cpfSchema = z.object({
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos'),
});

const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type CpfForm = z.infer<typeof cpfSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function PrimeiroAcessoPage() {
  const router = useRouter();
  const [step, setStep] = useState<'cpf' | 'register'>('cpf');
  const [cpf, setCpf] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const cpfForm = useForm<CpfForm>({
    resolver: zodResolver(cpfSchema),
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const handleCpfSubmit = async (data: CpfForm) => {
    setIsLoading(true);
    try {
      const cleanCpf = data.cpf.replace(/\D/g, '');
      const response = await api.post('/auth/validate-cpf', { cpf: cleanCpf });
      
      if (response.data.success) {
        setCpf(cleanCpf);
        setStep('register');
        toast.success('CPF válido! Preencha os dados para criar sua conta.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao validar CPF');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', {
        cpf,
        name: data.name,
        email: data.email,
        password: data.password,
      });
      
      if (response.data.success) {
        localStorage.setItem('auth_token', response.data.data.token);
        toast.success('Conta criada com sucesso!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg p-8">
          {/* Logo e Título */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {step === 'cpf' ? 'Primeiro Acesso' : 'Complete seu Cadastro'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {step === 'cpf' 
                ? 'Digite seu CPF para iniciar o cadastro' 
                : 'Preencha seus dados para finalizar'}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'cpf' ? 'bg-primary text-white' : 'bg-green-500 text-white'
              }`}>
                {step === 'register' ? '✓' : '1'}
              </div>
              <div className={`w-16 h-1 ${step === 'register' ? 'bg-primary' : 'bg-gray-300'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'register' ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
            </div>
          </div>

          {step === 'cpf' ? (
            <form onSubmit={cpfForm.handleSubmit(handleCpfSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CPF
                </label>
                <InputMask
                  mask="999.999.999-99"
                  {...cpfForm.register('cpf')}
                >
                  {(inputProps: any) => (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        {...inputProps}
                        type="text"
                        placeholder="000.000.000-00"
                        className="w-full pl-10 px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  )}
                </InputMask>
                {cpfForm.formState.errors.cpf && (
                  <p className="text-danger text-sm mt-1">
                    {cpfForm.formState.errors.cpf.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                {isLoading ? 'Verificando...' : 'Continuar'}
              </Button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-5">
              <Input
                label="Nome Completo"
                type="text"
                placeholder="Seu nome completo"
                icon={<User className="w-5 h-5 text-gray-400" />}
                error={registerForm.formState.errors.name?.message}
                {...registerForm.register('name')}
              />

              <Input
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                icon={<Mail className="w-5 h-5 text-gray-400" />}
                error={registerForm.formState.errors.email?.message}
                {...registerForm.register('email')}
              />

              <Input
                label="Senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                error={registerForm.formState.errors.password?.message}
                {...registerForm.register('password')}
              />

              <Input
                label="Confirmar Senha"
                type="password"
                placeholder="Digite a senha novamente"
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                error={registerForm.formState.errors.confirmPassword?.message}
                {...registerForm.register('confirmPassword')}
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep('cpf')}
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  isLoading={isLoading}
                >
                  {isLoading ? 'Criando...' : 'Criar Conta'}
                </Button>
              </div>
            </form>
          )}

          {/* Link para Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          © 2025 Médicos Consultas Online. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
