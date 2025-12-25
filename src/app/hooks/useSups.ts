import { useState, useEffect } from "react";
import { OptionType } from "../components/models/CommonModels";
import { getListSup } from "../controllers/UserSystem/UserSystemController";

export const useSups = (trigger: boolean) => {
  const [sup, setSup] = useState<OptionType[]>([]);

  useEffect(() => {
    if (!trigger) return; // Chỉ gọi API khi trigger = true

    const fetchSups = async () => {
      try {
        const result = await getListSup();
        if (Array.isArray(result.Data)) {
          const supOptions = result.Data.map((item: any) => ({
            value: item.SupCode,
            label: item.SupName
          }));
          setSup(supOptions);
        }
      } catch (error) {
        console.error("Lỗi hiển thị SUP:", error);
      }
    };

    fetchSups();
  }, [trigger]);

  return sup;
};
