import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { OptionType } from '../models/CommonModels';

// Định nghĩa kiểu dữ liệu cho props
interface SearchableComboBoxProps {
  options: OptionType[];
  value: OptionType | null;
  onChange: (selected: OptionType | null) => void;
  width?: string;
  includeAllOption?: boolean;
  isDisabled?: boolean;
}

export const SearchableComboBox: React.FC<SearchableComboBoxProps> = ({
  options,
  value,
  onChange,
  width = '100%',
  includeAllOption = false,
  isDisabled = false,
}) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(value);

  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  const handleChange = (selected: OptionType | null) => {
    setSelectedOption(selected);
    onChange(selected);
  };

  const formattedOptions = includeAllOption
    ? [{ value: '', label: 'Tất cả' }, ...options]
    : options;

  return (
    <Select
      options={formattedOptions}
      value={selectedOption}
      onChange={handleChange}
      placeholder="Tìm kiếm..."
      isSearchable
      isDisabled={isDisabled}
      noOptionsMessage={() => 'Không có kết quả phù hợp'}
      styles={{
        control: (base, state) => ({
          ...base,
          width,
          minHeight: '40px',
          borderRadius: '8px',
          borderColor: state.isFocused ? '#3699FF' : '#E4E6EF',
          boxShadow: state.isFocused ? '0 0 0 1px #3699FF' : 'none',
          '&:hover': { borderColor: '#A1A5B7' },
        }),
        menu: (base) => ({
          ...base,
          borderRadius: '8px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected ? '#EEF3F7' : 'white',
          color: state.isSelected ? '#3699FF' : '#181C32',
          '&:hover': { backgroundColor: '#F3F6F9' },
        }),
      }}
    />
  );
};