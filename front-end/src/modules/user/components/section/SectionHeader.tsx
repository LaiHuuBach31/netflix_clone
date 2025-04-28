// components/SectionHeader.tsx
import { Select } from 'antd';
const { Option } = Select;

type SectionHeaderProps = {
  title: string;
  showSelect?: boolean;
  selectValue?: string;
  onSelectChange?: (value: string) => void;
};

const SectionHeader = ({
  title,
  showSelect = false,
  selectValue = 'A-Z',
  onSelectChange,
}: SectionHeaderProps) => {
  return (
    <div className="flex justify-between items-center border-b border-[#3b3b5b] py-2 px-4 bg-[#2b2b28] mt-[30px] mb-[30px]">
      <div className="flex items-center">
        <div className="w-[3px] h-5 bg-red-600 mr-2"></div>
        <h2 className="text-white font-bold uppercase text-sm">{title}</h2>
      </div>

      {showSelect && (
        <div className="flex items-center gap-2 text-white text-sm">
          <span>Order by:</span>
          <Select
            defaultValue={selectValue}
            className="w-[80px]"
            size="small"
            popupClassName="text-black"
            onChange={onSelectChange}
          >
            <Option value="A-Z">A-Z</Option>
            <Option value="Z-A">Z-A</Option>
            <Option value="Newest">Newest</Option>
          </Select>
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
