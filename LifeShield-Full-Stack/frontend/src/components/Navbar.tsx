import React, { useState } from 'react';
import { AgeGroupInfo, UserProfile } from '../types';
import {
  Shield,
  HeartPulse,
  Activity,
  BarChart3,
  ClipboardCheck,
  Syringe,
  Bell,
  QrCode,
  User,
  Menu,
  X,
  LogOut
} from 'lucide-react';

export type NavTab = 'overview' | 'daily' | 'analytics' | 'assessment' | 'vaccines' | 'reminders' | 'emergency';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  profile: UserProfile;
  ageGroupInfo: AgeGroupInfo;
  onOpenProfile: () => void;
  onOpenEmergencyModal: () => void;
  pendingRemindersCount: number;
  overdueVaccinesCount: number;
  onLogout: () => void;
  authUser?: { name: string; email: string } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  profile,
  ageGroupInfo,
  onOpenProfile,
  onOpenEmergencyModal,
  pendingRemindersCount,
  overdueVaccinesCount,
  onLogout,
  authUser
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <HeartPulse className="w-4 h-4" /> },
    { id: 'daily', label: 'Daily Tracker', icon: <Activity className="w-4 h-4" /> },
    { id: 'analytics', label: 'Weekly Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'assessment', label: 'Health Assessment', icon: <ClipboardCheck className="w-4 h-4" /> },
    {
      id: 'vaccines',
      label: 'Vaccinations',
      icon: <Syringe className="w-4 h-4" />,
      badge: overdueVaccinesCount > 0 ? overdueVaccinesCount : undefined,
      badgeColor: 'bg-rose-500'
    },
    {
      id: 'reminders',
      label: 'Reminders',
      icon: <Bell className="w-4 h-4" />,
      badge: pendingRemindersCount > 0 ? pendingRemindersCount : undefined,
      badgeColor: 'bg-amber-500'
    },
    { id: 'emergency', label: 'Emergency Card', icon: <QrCode className="w-4 h-4 text-red-500" /> }
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              id="btn-brand-home"
              onClick={() => handleTabClick('overview')}
              className="flex items-center gap-2 text-left group focus:outline-hidden"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Shield className="w-5 h-5 fill-white/20" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight font-display">LifeShield</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded border border-teal-200">
                    Health
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 hidden 2xl:block">Preventive Health &amp; Wellness Platform</span>
              </div>
            </button>

            {/* Age Persona Pill */}
            <div className="hidden 2xl:flex items-center gap-1.5 bg-slate-100/90 text-slate-700 px-2.5 py-1 rounded-full text-xs border border-slate-200 ml-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-800">{ageGroupInfo.label}</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 min-w-0 overflow-x-auto py-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3 xl:py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                    isActive
                      ? 'text-teal-700 bg-teal-50 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`ml-1 text-[10px] text-white font-bold px-1.5 py-0.2 rounded-full ${
                        item.badgeColor || 'bg-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Emergency QR, User Profile, & Prominent Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto">
            {/* Quick Emergency Button */}
            <button
              id="btn-nav-emergency-qr"
              onClick={onOpenEmergencyModal}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 shadow-xs transition-colors shrink-0"
              title="Open Emergency Health QR Card"
            >
              <QrCode className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden sm:inline">Emergency QR</span>
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            </button>

            {/* User Profile Button */}
            <button
              id="btn-nav-user-profile"
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-1.5 sm:pl-2 pr-2 sm:pr-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors shrink-0"
              title="View profile & account details"
            >
              <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {(authUser?.name || profile.name).charAt(0) || 'U'}
              </div>
              <div className="text-left hidden md:block">
                <span className="block leading-none truncate max-w-[90px]">{authUser?.name || profile.name}</span>
                <span className="text-[10px] font-medium text-slate-400 leading-none">
                  {profile.bloodGroup} • {profile.age}y
                </span>
              </div>
            </button>

            {/* Logout Button (Prominent & Always Visible) */}
            <button
              id="btn-nav-logout"
              onClick={onLogout}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 hover:text-rose-800 border border-rose-200 transition-colors shadow-xs"
              title="Log out of LifeShield"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Logout</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 shrink-0"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div id="mobile-nav-menu" className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg">
          {/* Active Account Header in Mobile Menu */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {(authUser?.name || profile.name).charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-slate-800 truncate">{authUser?.name || profile.name}</span>
                <span className="block text-[11px] text-slate-500 truncate">{authUser?.email || 'Logged in'}</span>
              </div>
            </div>
            <button
              id="mobile-nav-logout-header"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onLogout();
              }}
              className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-100/80 hover:bg-rose-200 border border-rose-200 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>

          <div className="flex items-center justify-between py-1 px-2 border-b border-slate-100">
            <span className="text-xs text-slate-500">Active Profile:</span>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              {profile.name} ({ageGroupInfo.label})
            </span>
          </div>

          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg ${
                  isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] text-white font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenProfile();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              <User className="w-3.5 h-3.5" />
              Edit Profile
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenEmergencyModal();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              <QrCode className="w-3.5 h-3.5" />
              Emergency QR
            </button>
            <button
              id="mobile-nav-logout-bottom"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onLogout();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 rounded-lg hover:bg-rose-100"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
