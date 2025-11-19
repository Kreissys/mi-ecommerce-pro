// src/components/Badge.jsx
import React from 'react';
import { HiFire, HiSparkles, HiExclamation, HiTag } from 'react-icons/hi';

const Badge = ({ type, text, className = '' }) => {
  const badges = {
    nuevo: {
      bg: 'bg-blue-500',
      text: 'text-white',
      icon: <HiSparkles className="h-3 w-3" />,
      label: text || 'Nuevo'
    },
    agotado: {
      bg: 'bg-red-500',
      text: 'text-white',
      icon: <HiExclamation className="h-3 w-3" />,
      label: text || 'Agotado'
    },
    descuento: {
      bg: 'bg-orange-500',
      text: 'text-white',
      icon: <HiTag className="h-3 w-3" />,
      label: text || '-15% OFF'
    },
    popular: {
      bg: 'bg-purple-500',
      text: 'text-white',
      icon: <HiFire className="h-3 w-3" />,
      label: text || 'Popular'
    },
    stock: {
      bg: 'bg-green-500',
      text: 'text-white',
      icon: null,
      label: text || 'Disponible'
    }
  };

  const badge = badges[type] || badges.nuevo;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text} shadow-sm ${className}`}
    >
      {badge.icon}
      {badge.label}
    </span>
  );
};

export default Badge;