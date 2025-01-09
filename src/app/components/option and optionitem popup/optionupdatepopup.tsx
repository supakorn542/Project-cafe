import React, { useState } from "react";
import { OptionInterface } from "@/app/interfaces/optioninterface";
import OptionItemPopup from "./OptionItemPopup";

interface OptionPopupProps {
  options: OptionInterface[];
  selectedOptions: { option: OptionInterface; items: any[] }[];
  onClose: () => void;
  onToggleOption: (option: OptionInterface) => void;
}

const OptionupdatePopup: React.FC<OptionPopupProps> = ({
  options,
  selectedOptions,
  onClose,
  onToggleOption,
}) => {

    const handleCloseOptionItemPopup = () => {
        setSelectedOptionForUpdate(null); // ปิด popup
      };
    const [selectedOptionForUpdate, setSelectedOptionForUpdate] = useState<OptionInterface | null>(null);
    const handleUpdateOption = (option: OptionInterface) => {
        setSelectedOptionForUpdate(option); // เปิด popup เพื่อแสดงรายการ option items
      };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Popup Container */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 text-center">Select Options</h2>

        {/* Options List */}
        <div className="space-y-3">
          {options.map((option) => (
            <label
              key={option.id}
              className="flex items-center space-x-3 p-2 border rounded-md hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedOptions.some(
                  (selected) => selected.option.id === option.id
                )}
                onChange={() => onToggleOption(option)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-800">{option.name}</span>
              <button type="button" onClick={() => handleUpdateOption(option)}>อัปเดท</button>
            </label>
          ))}
        </div>

        {selectedOptionForUpdate && (
        <OptionItemPopup
        option={{
          id: selectedOptionForUpdate.id!, // แปลงเป็น string แน่นอน
          name: selectedOptionForUpdate.name!,
          require: selectedOptionForUpdate.require!,
        }}
          onClose={handleCloseOptionItemPopup}
        />
      )}

        {/* Actions */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionupdatePopup;
