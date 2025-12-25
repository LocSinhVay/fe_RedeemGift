import React, { useState, useEffect } from 'react'
import Select, { MultiValue } from 'react-select'
import { OptionType } from '../models/CommonModels'

interface SearchableMultiComboBoxProps {
  options: OptionType[]
  value: OptionType[] // luôn là mảng
  onChange: (selected: OptionType[]) => void
  width?: string
  includeAllOption?: boolean
  isDisabled?: boolean
}

export const SearchableMultiComboBox: React.FC<SearchableMultiComboBoxProps> = ({
  options,
  value,
  onChange,
  width = '100%',
  includeAllOption = false,
  isDisabled = false,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>(value)

  useEffect(() => {
    setSelectedOptions(value)
  }, [value])

  const handleChange = (selected: MultiValue<OptionType>) => {
    const selectedArray = Array.isArray(selected) ? selected : []
    setSelectedOptions(selectedArray)
    onChange(selectedArray)
  }

  const formattedOptions = includeAllOption
    ? [{ value: 'ALL', label: 'Tất cả' }, ...options]
    : options

  return (
    <Select
      options={formattedOptions}
      value={selectedOptions}
      onChange={handleChange}
      isMulti={true}
      placeholder='Chọn nhiều...'
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
        multiValue: (base) => ({
          ...base,
          backgroundColor: '#E1F0FF',
          borderRadius: '6px',
        }),
        multiValueLabel: (base) => ({
          ...base,
          color: '#0056B3',
          fontWeight: 500,
        }),
        multiValueRemove: (base) => ({
          ...base,
          color: '#0056B3',
          ':hover': { backgroundColor: '#D0E8FF', color: '#000' },
        }),
      }}
    />
  )
}
