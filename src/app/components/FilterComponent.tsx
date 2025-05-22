// src/components/FilterComponent.tsx
import React from "react";

interface Filters {
  district: string;
  neighborhood: string;
  size: string;
  sortBy: string;
}

interface FilterComponentProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  handleRefresh: () => void;
}

export default function FilterComponent({
  filters,
  setFilters,
  handleRefresh,
}: FilterComponentProps) {
  return (
    <div className="w-full bg-white border-b px-4 py-3 shadow-md">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <select
          className="border rounded px-2 py-1"
          value={filters.district}
          onChange={(e) => setFilters({ ...filters, district: e.target.value })}
        >
          <option value="">전체 지역</option>
          <option value="강남구">강남구</option>
          <option value="마포구">마포구</option>
        </select>

        <select
          className="border rounded px-2 py-1"
          value={filters.neighborhood}
          onChange={(e) =>
            setFilters({ ...filters, neighborhood: e.target.value })
          }
        >
          <option value="">전체 동</option>
          <option value="서초동">서초동</option>
          <option value="신촌동">신촌동</option>
        </select>

        <select
          className="border rounded px-2 py-1"
          value={filters.size}
          onChange={(e) => setFilters({ ...filters, size: e.target.value })}
        >
          <option value="소형견">소형견</option>
          <option value="중형견">중형견</option>
          <option value="대형견">대형견</option>
        </select>

        <select
          className="border rounded px-2 py-1"
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          <option value="최신순">최신순</option>
          <option value="좋아요순">좋아요순</option>
        </select>
      </div>

      <div className="mt-4 text-right">
        <button
          onClick={handleRefresh}
          className="text-sm px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          초기화
        </button>
      </div>
    </div>
  );
}
