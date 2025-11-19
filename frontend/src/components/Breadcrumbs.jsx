// src/components/Breadcrumbs.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { HiHome, HiChevronRight } from 'react-icons/hi';

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-primary-600 transition-colors"
          >
            <HiHome className="w-4 h-4 mr-2" />
            Inicio
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index}>
              <div className="flex items-center">
                <HiChevronRight className="w-5 h-5 text-gray-400" />
                {isLast ? (
                  <span className="ml-1 text-sm font-medium text-gray-700 md:ml-2">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="ml-1 text-sm font-medium text-gray-500 hover:text-brand-primary-600 md:ml-2 transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;