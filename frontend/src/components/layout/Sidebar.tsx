'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  Home,
  Calendar,
  Users,
  CreditCard,
  User,
  Settings,
  XCircle,
  LogOut,
  Stethoscope,
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  {
    icon: Calendar,
    label: 'Consultas',
    href: '/consultas',
    subItems: [
      { label: 'Agendar', href: '/consultas/agendar' },
      { label: 'Histórico', href: '/consultas/historico' },
      { label: 'Atendimento Imediato', href: '/consultas/imediato' },
    ],
  },
  { icon: Users, label: 'Dependentes', href: '/dependentes' },
  { icon: CreditCard, label: 'Faturas', href: '/faturas' },
  { icon: User, label: 'Meus Dados', href: '/meus-dados' },
  { icon: Settings, label: 'Configurações', href: '/configuracoes' },
  { icon: XCircle, label: 'Cancelar Plano', href: '/cancelar-plano', danger: true },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 top-0 h-full w-64 bg-white dark:bg-surface-dark border-r border-border-light dark:border-border-dark',
          'transform transition-transform duration-300 ease-in-out z-50',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border-light dark:border-border-dark">
          <Stethoscope className="w-8 h-8 text-primary mr-2" />
          <span className="font-bold text-lg text-gray-900 dark:text-white">
            MCO
          </span>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-border-light dark:border-border-dark">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                Usuário
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                usuario@example.com
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={clsx(
                    'flex items-center px-4 py-3 rounded-xl transition-all duration-200',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    isActive && 'bg-primary/10 text-primary border-l-4 border-primary',
                    !isActive && 'text-gray-700 dark:text-gray-300',
                    item.danger && 'text-danger hover:bg-danger/10'
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </Link>

                {/* Sub-items */}
                {item.subItems && isActive && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={onClose}
                        className={clsx(
                          'block px-4 py-2 rounded-lg text-sm transition-colors',
                          pathname === subItem.href
                            ? 'text-primary font-medium bg-primary/5'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        )}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-border-light dark:border-border-dark">
          <button
            className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
