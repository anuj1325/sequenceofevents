/**
 * Timeline filtering form component
 */

import { Calendar, Filter, Search, X } from 'lucide-react';
import React, { useState } from 'react';
import { EventStatus, Priority, TimelineFilters } from '../../types';
import { Button } from '../UI/Button';

interface FilterFormProps {
  filters: TimelineFilters;
  onFiltersChange: (filters: TimelineFilters) => void;
  onClearFilters: () => void;
}

export const FilterForm: React.FC<FilterFormProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof TimelineFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleArrayFilterChange = (key: keyof TimelineFilters, value: string, checked: boolean) => {
    const currentArray = (filters[key] as string[]) || [];
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    handleFilterChange(key, newArray.length > 0 ? newArray : undefined);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0)
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-500" />
          <h3 className="font-medium text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              icon={X}
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search events..."
            value={filters.searchText || ''}
            onChange={(e) => handleFilterChange('searchText', e.target.value || undefined)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="date"
                  value={filters.dateRange?.start || ''}
                  onChange={(e) => handleFilterChange('dateRange', {
                    ...filters.dateRange,
                    start: e.target.value
                  })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="date"
                  value={filters.dateRange?.end || ''}
                  onChange={(e) => handleFilterChange('dateRange', {
                    ...filters.dateRange,
                    end: e.target.value
                  })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="flex flex-wrap gap-2">
              {(['urgent', 'high', 'medium', 'low'] as Priority[]).map(priority => (
                <label key={priority} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(filters.priority || []).includes(priority)}
                    onChange={(e) => handleArrayFilterChange('priority', priority, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {priority.toUpperCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sender Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sender
            </label>
            <div className="flex flex-wrap gap-4">
              {(['Contractor', 'NHAI'] as const).map(sender => (
                <label key={sender} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(filters.sender || []).includes(sender)}
                    onChange={(e) => handleArrayFilterChange('sender', sender, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    sender === 'Contractor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {sender}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {(['draft', 'sent', 'received', 'in_progress', 'completed', 'overdue'] as EventStatus[]).map(status => (
                <label key={status} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(filters.status || []).includes(status)}
                    onChange={(e) => handleArrayFilterChange('status', status, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {status.replace('_', ' ').toUpperCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Overdue Toggle */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.isOverdue === true}
                onChange={(e) => handleFilterChange('isOverdue', e.target.checked ? true : undefined)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Show only overdue events
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterForm;